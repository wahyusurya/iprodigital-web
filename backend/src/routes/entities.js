import { Router } from 'express';
import mongoose from 'mongoose';
import { COLLECTIONS, PUBLIC_READ } from '../models.js';
import { requireAuth, requireAdmin } from '../auth.js';

export const entitiesRouter = Router();

entitiesRouter.param('collection', (req, res, next, c) => {
  const Model = COLLECTIONS[c];
  if (!Model) return res.status(404).json({ message: `Unknown collection: ${c}` });
  req.Model = Model;
  next();
});

// ponytail: strip $-keys to blunt operator injection; allow-list if exposed wider.
function sanitize(query) {
  if (typeof query !== 'object' || query === null || Array.isArray(query)) return {};
  const out = {};
  for (const [k, v] of Object.entries(query)) {
    if (k.startsWith('$')) continue;
    out[k] = v && typeof v === 'object' && !Array.isArray(v) ? sanitize(v) : v;
  }
  return out;
}

// "-created_date" -> { createdAt: -1 }
function parseSort(sort) {
  if (!sort) return { createdAt: -1 };
  const desc = sort.startsWith('-');
  const raw = desc ? sort.slice(1) : sort;
  const field = raw === 'created_date' ? 'createdAt' : raw === 'updated_date' ? 'updatedAt' : raw;
  return { [field]: desc ? -1 : 1 };
}

// Public READ allowlist (company-site content). users is never public.
const maybeAuth = (req, res, next) =>
  PUBLIC_READ.has(req.params.collection) ? next() : requireAuth(req, res, next);

entitiesRouter.get('/:collection', maybeAuth, async (req, res, next) => {
  try {
    const limit = Math.min(parseInt(req.query.limit || '100', 10), 2000);
    res.json(await req.Model.find().sort(parseSort(req.query.sort)).limit(limit).lean());
  } catch (e) { next(e); }
});

entitiesRouter.post('/:collection/filter', maybeAuth, async (req, res, next) => {
  try {
    const limit = Math.min(parseInt(req.query.limit || '500', 10), 5000);
    res.json(await req.Model.find(sanitize(req.body)).sort(parseSort(req.query.sort)).limit(limit).lean());
  } catch (e) { next(e); }
});

entitiesRouter.get('/:collection/:id', maybeAuth, async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) return res.status(400).json({ message: 'Invalid id' });
    const item = await req.Model.findById(req.params.id).lean();
    if (!item) return res.status(404).json({ message: 'Not found' });
    res.json(item);
  } catch (e) { next(e); }
});

// Writes: admin only. No public write endpoints — this site has no public forms.
entitiesRouter.post('/:collection', requireAuth, requireAdmin, async (req, res, next) => {
  try { res.json(await req.Model.create(req.body)); } catch (e) { next(e); }
});

entitiesRouter.patch('/:collection/:id', requireAuth, requireAdmin, async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) return res.status(400).json({ message: 'Invalid id' });
    const item = await req.Model.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true }).lean();
    if (!item) return res.status(404).json({ message: 'Not found' });
    res.json(item);
  } catch (e) { next(e); }
});

entitiesRouter.delete('/:collection/:id', requireAuth, requireAdmin, async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) return res.status(400).json({ message: 'Invalid id' });
    await req.Model.findByIdAndDelete(req.params.id);
    res.json({ ok: true });
  } catch (e) { next(e); }
});

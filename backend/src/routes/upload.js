import { Router } from 'express';
import multer from 'multer';
import path from 'node:path';
import fs from 'node:fs';
import crypto from 'node:crypto';
import { config } from '../config.js';
import { requireAuth, requireAdmin } from '../auth.js';

export const uploadRouter = Router();

const uploadDir = path.resolve(config.uploadDir);
fs.mkdirSync(uploadDir, { recursive: true });

const ALLOWED = new Set(['.png', '.jpg', '.jpeg', '.webp', '.gif', '.svg', '.mp4', '.webm', '.pdf']);
const upload = multer({
  storage: multer.diskStorage({
    destination: uploadDir,
    filename: (_req, file, cb) => cb(null, `${Date.now()}-${crypto.randomBytes(6).toString('hex')}${path.extname(file.originalname).toLowerCase()}`),
  }),
  limits: { fileSize: 25 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(ALLOWED.has(ext) ? null : new Error(`Tipe file tidak didukung: ${ext}`), ALLOWED.has(ext));
  },
});

// POST /upload (admin) -> { file_url } — shape kept for Base44 ImageUploader components.
uploadRouter.post('/', requireAuth, requireAdmin, upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'File wajib diisi' });
  res.json({ file_url: `/api/files/${req.file.filename}` });
});

// GET /:name — public read of uploaded assets, path-traversal safe. Mount at /api/files.
export const filesRouter = Router();
filesRouter.get('/:name', (req, res) => {
  const name = path.basename(req.params.name); // strips any traversal
  const p = path.join(uploadDir, name);
  if (!p.startsWith(uploadDir) || !fs.existsSync(p)) return res.status(404).json({ message: 'Not found' });
  res.sendFile(p);
});

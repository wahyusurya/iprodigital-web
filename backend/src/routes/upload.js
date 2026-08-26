import { Router } from 'express';
import multer from 'multer';
import path from 'node:path';
import fs from 'node:fs';
import crypto from 'node:crypto';
import { config } from '../config.js';
import { requireAuth, requireAdmin } from '../auth.js';
import { isS3Enabled, storeBuffer, publicUrl } from '../storage.js';

export const uploadRouter = Router();

const uploadDir = path.resolve(config.uploadDir);
fs.mkdirSync(uploadDir, { recursive: true });

const ALLOWED = new Set(['.png', '.jpg', '.jpeg', '.webp', '.gif', '.svg', '.mp4', '.webm', '.pdf']);

const multerStorage = isS3Enabled()
  ? multer.memoryStorage()
  : multer.diskStorage({
      destination: uploadDir,
      filename: (_req, file, cb) => {
        const ext = path.extname(file.originalname).toLowerCase();
        cb(null, `${Date.now()}-${crypto.randomBytes(6).toString('hex')}${ext}`);
      },
    });

const upload = multer({
  storage: multerStorage,
  limits: { fileSize: 25 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(ALLOWED.has(ext) ? null : new Error(`Tipe file tidak didukung: ${ext}`), ALLOWED.has(ext));
  },
});

// POST /upload (admin) -> { file_url } — shape kept for Base44 ImageUploader components.
uploadRouter.post('/', requireAuth, requireAdmin, upload.single('file'), async (req, res, next) => {
  if (!req.file) return res.status(400).json({ message: 'File wajib diisi' });
  try {
    if (isS3Enabled()) {
      const filename = `${Date.now()}-${crypto.randomBytes(6).toString('hex')}${path.extname(req.file.originalname).toLowerCase()}`;
      const fileUrl = await storeBuffer(filename, req.file.buffer, req.file.mimetype);
      res.json({ file_url: fileUrl });
    } else {
      res.json({ file_url: `/api/files/${req.file.filename}` });
    }
  } catch (err) {
    next(err);
  }
});

// GET /:name — public read of uploaded assets, path-traversal safe. Mount at /api/files.
export const filesRouter = Router();
filesRouter.get('/:name', async (req, res, next) => {
  const name = path.basename(req.params.name); // strips any traversal
  if (isS3Enabled()) {
    try {
      const { Body, ContentType, ContentLength } = await import('../storage.js').then((m) => m.getObjectStream(name));
      if (ContentType) res.setHeader('Content-Type', ContentType);
      if (ContentLength) res.setHeader('Content-Length', ContentLength);
      Body.pipe(res);
    } catch (err) {
      if (err.name === 'NoSuchKey') return res.status(404).json({ message: 'Not found' });
      next(err);
    }
    return;
  }

  const p = path.join(uploadDir, name);
  if (!p.startsWith(uploadDir) || !fs.existsSync(p)) return res.status(404).json({ message: 'Not found' });
  res.sendFile(p);
});

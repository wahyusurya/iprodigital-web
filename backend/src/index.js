import express from 'express';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { config } from './config.js';
import { User } from './models.js';
import { authRouter } from './routes/auth.js';
import { entitiesRouter } from './routes/entities.js';
import { uploadRouter, filesRouter } from './routes/upload.js';

const app = express();
app.use(express.json({ limit: '2mb' }));

app.get('/api/health', (_req, res) => res.json({ ok: true, app: config.appName }));
app.use('/api/auth', authRouter);
app.use('/api/upload', uploadRouter);
app.use('/api/files', filesRouter);
app.use('/api', entitiesRouter);

// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(err.status || 500).json({ message: err.message || 'Internal error' });
});

async function seedAdmin() {
  if (!config.adminEmail || !config.adminPassword) return;
  const email = config.adminEmail.toLowerCase().trim();
  const existing = await User.findOne({ email });
  if (existing) {
    if (existing.role !== 'admin') await User.updateOne({ email }, { role: 'admin' });
    return;
  }
  await User.create({
    email,
    password_hash: await bcrypt.hash(config.adminPassword, 10),
    full_name: config.adminName,
    role: 'admin',
    verified: true,
  });
  console.log(`[seed] admin user created: ${email}`);
}

await mongoose.connect(config.mongoUri);
await seedAdmin();
app.listen(config.port, () => console.log(`${config.appName} backend on :${config.port}`));

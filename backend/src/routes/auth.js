import { Router } from 'express';
import bcrypt from 'bcryptjs';
import crypto from 'node:crypto';
import { User, Token } from '../models.js';
import { signToken, requireAuth, publicUser } from '../auth.js';
import { sendEmail } from '../services/email.js';
import { config } from '../config.js';

export const authRouter = Router();

const OTP_TTL_MIN = 10;
const RESET_TTL_MIN = 30;
const newOtp = () => String(crypto.randomInt(0, 1000000)).padStart(6, '0');

async function issueOtp(email, payload) {
  const code = newOtp();
  await Token.findOneAndUpdate(
    { email, kind: 'otp' },
    { code, payload, expires: new Date(Date.now() + OTP_TTL_MIN * 60000) },
    { upsert: true, new: true },
  );
  await sendEmail({
    to: email,
    subject: `${config.appName} — kode verifikasi`,
    text: `Kode verifikasi Anda: ${code} (berlaku ${OTP_TTL_MIN} menit).`,
  });
}

// POST /auth/register { email, password, full_name? } — creates nothing until OTP verified.
// Role is forced to 'user'; self-promotion via body is ignored.
authRouter.post('/register', async (req, res) => {
  const { email, password, full_name = '' } = req.body || {};
  if (!email || !password || String(password).length < 8)
    return res.status(400).json({ message: 'Email dan password (min. 8 karakter) wajib diisi' });
  const norm = String(email).toLowerCase().trim();
  if (await User.findOne({ email: norm }))
    return res.status(409).json({ message: 'Email sudah terdaftar' });
  await issueOtp(norm, { password_hash: await bcrypt.hash(String(password), 10), full_name: String(full_name) });
  res.json({ ok: true, message: 'Kode verifikasi dikirim ke email' });
});

// POST /auth/verify-otp { email, otp } -> creates the user, returns token
authRouter.post('/verify-otp', async (req, res) => {
  const { email, otp } = req.body || {};
  const norm = String(email || '').toLowerCase().trim();
  const t = await Token.findOne({ email: norm, kind: 'otp', code: String(otp || ''), expires: { $gt: new Date() } });
  if (!t) return res.status(400).json({ message: 'Kode salah atau kedaluwarsa' });
  const user = await User.findOneAndUpdate(
    { email: norm },
    { password_hash: t.payload.password_hash, full_name: t.payload.full_name, role: 'user', verified: true },
    { upsert: true, new: true },
  );
  await t.deleteOne();
  res.json({ access_token: signToken(user), user: publicUser(user) });
});

// POST /auth/resend-otp { email }
authRouter.post('/resend-otp', async (req, res) => {
  const norm = String(req.body?.email || '').toLowerCase().trim();
  const t = await Token.findOne({ email: norm, kind: 'otp' });
  if (t) await issueOtp(norm, t.payload); // generic response either way
  res.json({ ok: true });
});

// POST /auth/login { email, password }
authRouter.post('/login', async (req, res) => {
  const { email, password } = req.body || {};
  const user = await User.findOne({ email: String(email || '').toLowerCase().trim() });
  if (!user || !(await bcrypt.compare(String(password || ''), user.password_hash)))
    return res.status(401).json({ message: 'Email atau password salah' });
  if (!user.verified)
    return res.status(403).json({ message: 'Email belum diverifikasi. Cek kode OTP di email Anda.' });
  res.json({ access_token: signToken(user), user: publicUser(user) });
});

// GET /auth/me
authRouter.get('/me', requireAuth, (req, res) => res.json(publicUser(req.user)));

// POST /auth/reset-password/request { email } — always generic 200
authRouter.post('/reset-password/request', async (req, res) => {
  const norm = String(req.body?.email || '').toLowerCase().trim();
  if (await User.findOne({ email: norm })) {
    const token = crypto.randomBytes(32).toString('hex');
    await Token.findOneAndUpdate(
      { email: norm, kind: 'reset' },
      { code: token, payload: {}, expires: new Date(Date.now() + RESET_TTL_MIN * 60000) },
      { upsert: true },
    );
    await sendEmail({
      to: norm,
      subject: `${config.appName} — reset password`,
      text: `Buka tautan ini untuk mengatur password baru (berlaku ${RESET_TTL_MIN} menit):\n${config.publicUrl}/reset-password?token=${token}`,
    });
  }
  res.json({ ok: true });
});

// POST /auth/reset-password/confirm { token, new_password }
authRouter.post('/reset-password/confirm', async (req, res) => {
  const { token, new_password } = req.body || {};
  if (!new_password || String(new_password).length < 8)
    return res.status(400).json({ message: 'Password baru min. 8 karakter' });
  const t = await Token.findOne({ kind: 'reset', code: String(token || ''), expires: { $gt: new Date() } });
  if (!t) return res.status(400).json({ message: 'Token salah atau kedaluwarsa' });
  await User.updateOne({ email: t.email }, { password_hash: await bcrypt.hash(String(new_password), 10), verified: true });
  await t.deleteOne();
  res.json({ ok: true });
});

// Google OAuth: not configured on this deployment. FE button hits this.
authRouter.get('/google', (_req, res) =>
  res.status(501).json({ message: 'Login Google belum dikonfigurasi. Gunakan email & password.' }));

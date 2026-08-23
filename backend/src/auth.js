import jwt from 'jsonwebtoken';
import { config } from './config.js';
import { User } from './models.js';

export const signToken = (user) =>
  jwt.sign({ sub: String(user._id), role: user.role }, config.jwtSecret, { expiresIn: config.jwtExpiry });

export const verifyToken = async (req) => {
  const h = req.headers.authorization || '';
  if (!h.startsWith('Bearer ')) return null;
  try {
    const payload = jwt.verify(h.slice(7), config.jwtSecret);
    const user = await User.findById(payload.sub).lean();
    return user || null;
  } catch {
    return null;
  }
};

export const requireAuth = async (req, res, next) => {
  const user = await verifyToken(req);
  if (!user) return res.status(401).json({ message: 'Authentication required' });
  req.user = user;
  next();
};

export const requireAdmin = (req, res, next) =>
  req.user?.role === 'admin' ? next() : res.status(403).json({ message: 'Admin only' });

export const publicUser = (u) =>
  u && { id: String(u._id), email: u.email, full_name: u.full_name, role: u.role, created_date: u.createdAt };

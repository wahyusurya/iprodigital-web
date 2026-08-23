import mongoose from 'mongoose';

const flexible = (name, fields = {}) =>
  mongoose.model(name, new mongoose.Schema(fields, { strict: false, timestamps: true }));

export const User = mongoose.model('User', new mongoose.Schema({
  email: { type: String, unique: true, lowercase: true, trim: true, required: true },
  password_hash: { type: String, required: true },
  full_name: { type: String, default: '' },
  role: { type: String, enum: ['admin', 'user'], default: 'user' },
  verified: { type: Boolean, default: false },
}, { timestamps: true }));

// OTP codes (registration verify) and password-reset tokens share one TTL collection.
export const Token = mongoose.model('Token', new mongoose.Schema({
  email: { type: String, lowercase: true, trim: true, index: true },
  kind: { type: String, enum: ['otp', 'reset'], required: true },
  code: { type: String, required: true },
  payload: { type: Object, default: {} }, // pending registration fields for otp
  expires: { type: Date, required: true },
}, { timestamps: true }));
Token.schema.index({ expires: 1 }, { expireAfterSeconds: 0 });

// Content collections — flexible schemas seeded from base44/entities/*.jsonc.
// Collection names: naive lowercase + 's', identical rule on the frontend client
// (SiteSettings -> sitesettingss, Gallery -> gallerys, News -> newss). Deliberate:
// one rule both sides beats a lookup table (ternakku precedent).
export const COLLECTIONS = {
  sitesettingss: flexible('SiteSettings'),
  aboutcontents: flexible('AboutContent'),
  events: flexible('Event'),
  gallerys: flexible('Gallery'),
  newss: flexible('News'),
  portfolios: flexible('Portfolio'),
  saasproducts: flexible('SaaSProduct'),
  socialproofs: flexible('SocialProof'),
  teammembers: flexible('TeamMember'),
};

// Public anonymous READ access (landing page). Everything else requires auth.
export const PUBLIC_READ = new Set(Object.keys(COLLECTIONS));

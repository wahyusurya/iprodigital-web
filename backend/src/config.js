import 'dotenv/config';

const required = (key) => {
  const v = process.env[key];
  if (!v) {
    console.error(`FATAL: ${key} is not set. Refusing to boot.`);
    process.exit(1);
  }
  return v;
};

export const config = {
  port: parseInt(process.env.PORT || '4000', 10),
  mongoUri: process.env.MONGO_URI || 'mongodb://localhost:27017/iprodigital',
  // Fail-closed: no default JWT secret (forged-admin risk).
  jwtSecret: required('JWT_SECRET'),
  jwtExpiry: process.env.JWT_EXPIRY || '12h',
  adminEmail: process.env.ADMIN_EMAIL || '',
  adminPassword: process.env.ADMIN_PASSWORD || '',
  adminName: process.env.ADMIN_NAME || 'Admin',
  appName: process.env.APP_NAME || 'Ipro Digital',
  publicUrl: process.env.PUBLIC_URL || 'http://localhost:8093',
  uploadDir: process.env.UPLOAD_DIR || 'uploads',
  s3: {
    endpoint: process.env.S3_ENDPOINT,
    bucket: process.env.S3_BUCKET,
    privateBucket: process.env.S3_PRIVATE_BUCKET || process.env.S3_BUCKET,
    accessKeyId: process.env.S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
    region: process.env.S3_REGION || 'us-east-1',
    publicUrl: process.env.S3_PUBLIC_URL && process.env.S3_PUBLIC_URL.replace(/\/$/, ''),
    forcePathStyle: true,
    enabled: !!(process.env.S3_ENDPOINT && process.env.S3_BUCKET && process.env.S3_ACCESS_KEY_ID && process.env.S3_SECRET_ACCESS_KEY && process.env.S3_PUBLIC_URL),
  },
  // Optional email chain: Mailgun -> Brevo -> SMTP -> log-only
  mailgun: {
    apiKey: process.env.MAILGUN_API_KEY || '',
    domain: process.env.MAILGUN_DOMAIN || '',
    from: process.env.MAIL_FROM || '',
  },
  brevo: { apiKey: process.env.BREVO_API_KEY || '', from: process.env.MAIL_FROM || '' },
  smtp: {
    host: process.env.SMTP_HOST || '',
    port: parseInt(process.env.SMTP_PORT || '587', 10),
    user: process.env.SMTP_USER || '',
    pass: process.env.SMTP_PASS || '',
    from: process.env.MAIL_FROM || '',
  },
  mailFrom: process.env.MAIL_FROM || 'no-reply@iprodigital.local',
};

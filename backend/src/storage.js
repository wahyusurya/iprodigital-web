import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { config } from './config.js';

const s3 = config.s3.enabled
  ? new S3Client({
      endpoint: config.s3.endpoint,
      region: config.s3.region,
      credentials: {
        accessKeyId: config.s3.accessKeyId,
        secretAccessKey: config.s3.secretAccessKey,
      },
      forcePathStyle: config.s3.forcePathStyle,
    })
  : null;

export function isS3Enabled() {
  return !!s3;
}

export function publicUrl(filename) {
  if (s3) return `${config.s3.publicUrl}/${filename}`;
  return `${config.publicUrl}/api/files/${filename}`;
}

export async function storeBuffer(filename, buffer, contentType) {
  if (!s3) throw new Error('S3 not configured');
  await s3.send(
    new PutObjectCommand({
      Bucket: config.s3.bucket,
      Key: filename,
      Body: buffer,
      ContentType: contentType || 'application/octet-stream',
    })
  );
  return publicUrl(filename);
}

export async function getObjectStream(key) {
  if (!s3) throw new Error('S3 not configured');
  const out = await s3.send(
    new GetObjectCommand({ Bucket: config.s3.bucket, Key: key })
  );
  return out;
}

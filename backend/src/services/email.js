import { config } from '../config.js';

// Provider precedence: Mailgun -> Brevo API -> SMTP -> log-only (UKRUN pattern).
// All HTTPS APIs preferred: outbound SMTP ports are blocked on the user's network.
export async function sendEmail({ to, subject, text, html }) {
  const from = config.mailFrom;
  try {
    if (config.mailgun.apiKey && config.mailgun.domain) {
      const body = new URLSearchParams({ from: `${config.appName} <${from}>`, to, subject, text: text || '', ...(html ? { html } : {}) });
      const r = await fetch(`https://api.mailgun.net/v3/${config.mailgun.domain}/messages`, {
        method: 'POST',
        headers: { Authorization: `Basic ${Buffer.from(`api:${config.mailgun.apiKey}`).toString('base64')}` },
        body,
      });
      if (!r.ok) throw new Error(`Mailgun ${r.status}: ${await r.text()}`);
      return { provider: 'mailgun' };
    }
    if (config.brevo.apiKey) {
      const r = await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: { 'api-key': config.brevo.apiKey, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sender: { name: config.appName, email: from },
          to: [{ email: to }],
          subject, textContent: text || '', ...(html ? { htmlContent: html } : {}),
        }),
      });
      if (!r.ok) throw new Error(`Brevo ${r.status}: ${await r.text()}`);
      return { provider: 'brevo' };
    }
    if (config.smtp.host) {
      const { default: nodemailer } = await import('nodemailer');
      const t = nodemailer.createTransport({
        host: config.smtp.host, port: config.smtp.port,
        auth: config.smtp.user ? { user: config.smtp.user, pass: config.smtp.pass } : undefined,
      });
      await t.sendMail({ from: `${config.appName} <${from}>`, to, subject, text, html });
      return { provider: 'smtp' };
    }
  } catch (e) {
    console.error(`[email] send failed (${e.message}). Falling back to log.`);
  }
  console.log(`[email:log-only] to=${to} subject=${subject}\n${text || ''}`);
  return { provider: 'log' };
}

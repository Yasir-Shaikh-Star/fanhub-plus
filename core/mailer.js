
const https = require('https');

function postJson(hostname, urlPath, headers, body) {
  return new Promise((resolve) => {
    const data = JSON.stringify(body);
    const req = https.request(
      {
        hostname,
        path: urlPath,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(data),
          ...headers
        }
      },
      (res) => {
        let raw = '';
        res.on('data', (chunk) => { raw += chunk; });
        res.on('end', () => {
          const ok = res.statusCode >= 200 && res.statusCode < 300;
          resolve({ ok, status: res.statusCode, body: raw });
        });
      }
    );
    req.on('error', (err) => resolve({ ok: false, status: 0, body: String(err && err.message || err) }));
    req.write(data);
    req.end();
  });
}

async function sendEmail({ to, subject, html, text }) {
  const brevoKey = process.env.BREVO_API_KEY;
  const resendKey = process.env.RESEND_API_KEY;

  if (brevoKey) {
    const senderEmail = process.env.BREVO_SENDER_EMAIL;
    if (!senderEmail) {
      console.error('[mailer] BREVO_API_KEY is set but BREVO_SENDER_EMAIL is missing.');
      return { ok: false, reason: 'not_configured' };
    }
    const result = await postJson('api.brevo.com', '/v3/smtp/email', { 'api-key': brevoKey }, {
      sender: { name: 'Fan Hub Plus', email: senderEmail },
      to: [{ email: to }],
      subject,
      htmlContent: html,
      textContent: text || undefined
    });
    if (result.ok) return { ok: true, provider: 'brevo' };
    console.error('[mailer] Brevo send failed:', result.status, result.body);
    return { ok: false, reason: 'send_failed', provider: 'brevo' };
  }

  if (resendKey) {
    const from = process.env.RESEND_FROM || 'Fan Hub Plus <onboarding@resend.dev>';
    const result = await postJson('api.resend.com', '/emails', { Authorization: `Bearer ${resendKey}` }, {
      from,
      to: [to],
      subject,
      html,
      text: text || undefined
    });
    if (result.ok) return { ok: true, provider: 'resend' };
    console.error('[mailer] Resend send failed:', result.status, result.body);
    return { ok: false, reason: 'send_failed', provider: 'resend' };
  }

  return { ok: false, reason: 'not_configured' };
}

module.exports = { sendEmail };

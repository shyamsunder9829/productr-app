const nodemailer = require('nodemailer');

const sendWithResend = async ({ recipient, otp, purpose }) => {
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      from: process.env.RESEND_FROM,
      to: [recipient],
      subject: 'Your Productr verification code',
      text: `Your Productr verification code is ${otp}. It expires in 10 minutes.`,
      html: `<div style="font-family:Arial,sans-serif;line-height:1.5;color:#172554"><h2>Productr verification code</h2><p>Use this code to ${purpose.toLowerCase()}:</p><p style="font-size:28px;font-weight:700;letter-spacing:6px">${otp}</p><p>This code expires in 10 minutes.</p><p>If you did not request this code, you can ignore this email.</p></div>`
    })
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Resend email failed (${response.status}): ${error}`);
  }

  return response.json();
};

const getTransporter = () => {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER } = process.env;
  const SMTP_PASS = (process.env.SMTP_PASS || '').replace(/\s/g, '');

  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS) {
    throw new Error('SMTP configuration is incomplete. Set SMTP_HOST, SMTP_PORT, SMTP_USER, and SMTP_PASS.');
  }

  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT),
    secure: String(SMTP_PORT) === '465',
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 15000,
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS
    }
  });
};

const hasSmtpConfiguration = () => Boolean(
  process.env.SMTP_HOST
  && process.env.SMTP_PORT
  && process.env.SMTP_USER
  && (process.env.SMTP_PASS || '').replace(/\s/g, '')
);

const sendWithSmtp = async ({ recipient, otp, purpose }) => {
  const fromAddress = process.env.SMTP_FROM || process.env.SMTP_USER;
  const info = await getTransporter().sendMail({
    from: fromAddress,
    replyTo: process.env.SMTP_USER,
    to: recipient,
    subject: 'Your Productr verification code',
    text: `Your Productr verification code is ${otp}. It expires in 10 minutes.`,
    html: `<div style="font-family:Arial,sans-serif;line-height:1.5;color:#172554"><h2>Productr verification code</h2><p>Use this code to ${purpose.toLowerCase()}:</p><p style="font-size:28px;font-weight:700;letter-spacing:6px">${otp}</p><p>This code expires in 10 minutes.</p><p>If you did not request this code, you can ignore this email.</p></div>`
  });

  console.log(`✉️ OTP email accepted via SMTP: ${info.messageId}`);
  return info;
};

const sendOTPEmail = async ({ recipient, otp, purpose }) => {
  if (process.env.RESEND_API_KEY && process.env.RESEND_FROM) {
    try {
      const info = await sendWithResend({ recipient, otp, purpose });
      console.log(`✉️ OTP email accepted via Resend: ${info.id}`);
      return info;
    } catch (err) {
      const isResendTestingRecipientError = err.message?.includes(
        'You can only send testing emails to your own email address'
      );
      if (!isResendTestingRecipientError) {
        throw err;
      }
      if (hasSmtpConfiguration()) {
        console.warn('Resend is in testing mode; retrying OTP delivery via configured SMTP.');
        return sendWithSmtp({ recipient, otp, purpose });
      }

      const configurationError = new Error(
        'Resend only allows the account owner to receive emails until a sending domain is verified. Verify a domain for RESEND_FROM or configure SMTP.'
      );
      configurationError.code = 'ERESEND_DOMAIN_UNVERIFIED';
      throw configurationError;
    }
  }

  return sendWithSmtp({ recipient, otp, purpose });
};

module.exports = { sendOTPEmail };
const nodemailer = require('nodemailer');

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

const sendOTPEmail = async ({ recipient, otp, purpose }) => {
  const fromAddress = process.env.SMTP_USER;

  const info = await getTransporter().sendMail({
    from: {
      name: 'Productr',
      address: fromAddress
    },
    replyTo: fromAddress,
    to: recipient,
    subject: 'Your Productr verification code',
    text: `Your Productr verification code is ${otp}. It expires in 10 minutes.`,
    html: `<div style="font-family:Arial,sans-serif;line-height:1.5;color:#172554"><h2>Productr verification code</h2><p>Use this code to ${purpose.toLowerCase()}:</p><p style="font-size:28px;font-weight:700;letter-spacing:6px">${otp}</p><p>This code expires in 10 minutes.</p><p>If you did not request this code, you can ignore this email.</p></div>`
  });

  console.log(`✉️ OTP email accepted for ${recipient}: ${info.messageId}`);
  return info;
};

module.exports = { sendOTPEmail };
module.exports = () => ({
  email: {
    config: {
      provider: 'nodemailer',
      providerOptions: {
        host: process.env.SMTP_HOST || 'smtp.resend.com',
        port: parseInt(process.env.SMTP_PORT) || 587,
        secure: false, // STARTTLS on 587
        auth: {
          user: process.env.SMTP_USER || 'resend',
          pass: process.env.SMTP_PASSWORD, // Resend API key
        },
        tls: {
          rejectUnauthorized: false
        }
      },
      settings: {
        defaultFrom: process.env.RESEND_FROM_EMAIL,
        defaultReplyTo: process.env.RESEND_FROM_EMAIL,
      },
    },
  },
});
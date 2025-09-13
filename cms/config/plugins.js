module.exports = ({ env }) => ({
  email: {
    config: {
      provider: 'nodemailer',
      providerOptions: {
        host: env('SMTP_HOST', 'smtp.resend.com'),
        port: Number(env('SMTP_PORT', 587)),
        secure: false, // STARTTLS on 587
        auth: {
          user: env('SMTP_USER', 'resend'),
          pass: env('SMTP_PASSWORD'), // Resend API key
        },
      },
      settings: {
        defaultFrom: env('RESEND_FROM_EMAIL'),
        defaultReplyTo: env('RESEND_FROM_EMAIL'),
      },
    },
  },
  'users-permissions': {
    config: {
      jwt: {
        expiresIn: '7d',
      },
    },
  },
});

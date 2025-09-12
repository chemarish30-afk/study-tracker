module.exports = ({ env }) => ({
  email: {
    config: {
      provider: 'nodemailer',
      providerOptions: {
        host: env('SMTP_HOST', 'smtp.resend.com'),
        port: env('SMTP_PORT', 587),
        secure: false,
        auth: {
          user: env('SMTP_USER', 'resend'),
          pass: env('SMTP_PASSWORD', env('RESEND_API_KEY')),
        },
      },
      settings: {
        defaultFrom: env('RESEND_FROM_EMAIL', 'your_verified_email@domain.com'),
        defaultReplyTo: env('RESEND_FROM_EMAIL', 'your_verified_email@domain.com'),
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

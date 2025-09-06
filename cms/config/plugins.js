module.exports = ({ env }) => ({
  email: {
    config: {
      provider: 'sendmail',
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

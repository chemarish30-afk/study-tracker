module.exports = ({ env }) => ({
  config: {
    jwt: {
      expiresIn: '7d',
      secret: env('JWT_SECRET', 'tobemodified'),
    },
    register: {
      allowedFields: ['username', 'email', 'password'],
    },
    email: {
      emailConfirmation: {
        enabled: true,
        redirection: 'https://study-tracker-nextjs.netlify.app/auth/email-confirmation',
      },
      resetPassword: {
        enabled: true,
        redirection: 'https://study-tracker-nextjs.netlify.app/auth/reset-password',
      },
    },
  },
});

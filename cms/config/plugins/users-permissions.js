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
        redirection: '/auth/email-confirmation',
      },
      resetPassword: {
        enabled: true,
        redirection: '/auth/reset-password',
      },
    },
  },
});

module.exports = ({ env }) => ({
  host: env('HOST', '0.0.0.0'),
  port: env.int('PORT', 1337),
  app: {
    keys: env.array('APP_KEYS', ['toBeModified1', 'toBeModified2', 'toBeModified3', 'toBeModified4']),
  },
  webhooks: {
    populateRelations: env.bool('WEBHOOKS_POPULATE_RELATIONS', false),
  },
  admin: {
    auth: {
      secret: env('ADMIN_JWT_SECRET', 'tobemodified'),
    },
  },
  api: {
    rest: {
      defaultLimit: 25,
      maxLimit: 100,
      withCount: true,
    },
  },
});

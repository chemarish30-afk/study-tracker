'use strict';

module.exports = (plugin) => {
  // Customize the email templates
  plugin.controllers.auth.sendEmailConfirmation = async (ctx) => {
    const { email } = ctx.request.body;
    
    if (!email) {
      return ctx.badRequest('Email is required');
    }

    const user = await strapi.query('plugin::users-permissions.user').findOne({
      where: { email },
    });

    if (!user) {
      return ctx.badRequest('User not found');
    }

    if (user.confirmed) {
      return ctx.badRequest('User already confirmed');
    }

    const confirmationToken = strapi.plugins['users-permissions'].services.user.generateConfirmationToken(user);
    
    await strapi.plugins['users-permissions'].services.user.edit(user.id, {
      confirmationToken,
    });

    // Send email using the configured email provider
    await strapi.plugins.email.services.email.send({
      to: email,
      from: process.env.RESEND_FROM_EMAIL,
      subject: 'Confirm your email address',
      html: `
        <h1>Welcome to Study Tracker!</h1>
        <p>Please click the link below to confirm your email address:</p>
        <a href="https://study-tracker-nextjs.netlify.app/auth/email-confirmation?confirmation=${confirmationToken}">
          Confirm Email
        </a>
        <p>If you didn't create an account, please ignore this email.</p>
      `,
    });

    ctx.send({ message: 'Confirmation email sent' });
  };

  // Let Strapi handle forgot password natively with the configured email service

  // Let Strapi handle reset password natively

  return plugin;
};

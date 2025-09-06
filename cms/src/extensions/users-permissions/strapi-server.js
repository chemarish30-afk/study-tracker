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
        <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/auth/email-confirmation?confirmation=${confirmationToken}">
          Confirm Email
        </a>
        <p>If you didn't create an account, please ignore this email.</p>
      `,
    });

    ctx.send({ message: 'Confirmation email sent' });
  };

  plugin.controllers.auth.forgotPassword = async (ctx) => {
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

    const resetPasswordToken = strapi.plugins['users-permissions'].services.user.generateResetPasswordToken(user);
    
    await strapi.plugins['users-permissions'].services.user.edit(user.id, {
      resetPasswordToken,
    });

    // Send email using the configured email provider
    await strapi.plugins.email.services.email.send({
      to: email,
      from: process.env.RESEND_FROM_EMAIL,
      subject: 'Reset your password',
      html: `
        <h1>Password Reset Request</h1>
        <p>You requested a password reset. Click the link below to reset your password:</p>
        <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/auth/reset-password?code=${resetPasswordToken}">
          Reset Password
        </a>
        <p>If you didn't request this, please ignore this email.</p>
      `,
    });

    ctx.send({ message: 'Password reset email sent' });
  };

  return plugin;
};

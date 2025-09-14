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

  // Custom forgot password handler
  plugin.controllers.auth.forgotPassword = async (ctx) => {
    const { email } = ctx.request.body;

    if (!email) {
      return ctx.badRequest('Email is required');
    }

    try {
      const user = await strapi.query('plugin::users-permissions.user').findOne({
        where: { email },
      });

      if (!user) {
        // For security, don't reveal if email exists or not
        return ctx.send({ message: 'If the email exists, a reset link has been sent' });
      }

      // Generate reset token
      const resetToken = strapi.plugins['users-permissions'].services.user.generateResetPasswordToken(user);
      const resetTokenExpiration = new Date();
      resetTokenExpiration.setHours(resetTokenExpiration.getHours() + 24); // 24 hours from now

      // Update user with reset token
      await strapi.query('plugin::users-permissions.user').update({
        where: { id: user.id },
        data: {
          resetPasswordToken: resetToken,
          resetPasswordTokenExpiration: resetTokenExpiration,
        },
      });

      // Send reset email
      await strapi.plugins.email.services.email.send({
        to: email,
        from: process.env.RESEND_FROM_EMAIL,
        subject: 'Reset your password - Study Tracker',
        html: `
          <h1>Reset Your Password</h1>
          <p>You requested a password reset for your Study Tracker account.</p>
          <p>Click the link below to reset your password:</p>
          <a href="https://study-tracker-nextjs.netlify.app/auth/reset-password?code=${resetToken}" 
             style="display: inline-block; padding: 10px 20px; background-color: #3B82F6; color: white; text-decoration: none; border-radius: 5px;">
            Reset Password
          </a>
          <p>This link will expire in 24 hours.</p>
          <p>If you didn't request this password reset, please ignore this email.</p>
        `,
      });

      ctx.send({ message: 'If the email exists, a reset link has been sent' });
    } catch (error) {
      console.error('Forgot password error:', error);
      return ctx.internalServerError('An error occurred while processing your request');
    }
  };

  // Custom reset password handler
  plugin.controllers.auth.resetPassword = async (ctx) => {
    const { code, password, passwordConfirmation } = ctx.request.body;

    if (!code) {
      return ctx.badRequest('Reset code is required');
    }

    if (!password) {
      return ctx.badRequest('Password is required');
    }

    if (password !== passwordConfirmation) {
      return ctx.badRequest('Passwords do not match');
    }

    if (password.length < 6) {
      return ctx.badRequest('Password must be at least 6 characters long');
    }

    try {
      // Find user by reset password token
      const user = await strapi.query('plugin::users-permissions.user').findOne({
        where: { resetPasswordToken: code },
      });

      if (!user) {
        return ctx.badRequest('Invalid or expired reset code');
      }

      // Check if token is expired (24 hours)
      const tokenExpiration = new Date(user.resetPasswordTokenExpiration);
      if (tokenExpiration < new Date()) {
        return ctx.badRequest('Reset code has expired');
      }

      // Update user password and clear reset token
      await strapi.query('plugin::users-permissions.user').update({
        where: { id: user.id },
        data: {
          password: await strapi.plugins['users-permissions'].services.user.hashPassword(password),
          resetPasswordToken: null,
          resetPasswordTokenExpiration: null,
        },
      });

      ctx.send({ message: 'Password reset successfully' });
    } catch (error) {
      console.error('Reset password error:', error);
      return ctx.internalServerError('An error occurred while resetting password');
    }
  };

  return plugin;
};

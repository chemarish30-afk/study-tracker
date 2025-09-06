'use strict';

/**
 * Bootstrap function that runs before the application starts
 * This is where we can set up initial data, permissions, etc.
 */

module.exports = async ({ strapi }) => {
  // Set up default permissions for public role
  const publicRole = await strapi
    .query('plugin::users-permissions.role')
    .findOne({ where: { type: 'public' } });

  if (publicRole) {
    // Allow public access to read content types
    const contentTypes = [
      'api::exam-course.exam-course',
      'api::subject.subject',
      'api::unit.unit',
      'api::chapter.chapter',
      'api::module.module',
      'api::content.content',
    ];

    for (const contentType of contentTypes) {
      await strapi
        .query('plugin::users-permissions.permission')
        .create({
          data: {
            action: `${contentType}.find`,
            subject: contentType,
            properties: {},
            conditions: [],
            role: publicRole.id,
          },
        });

      await strapi
        .query('plugin::users-permissions.permission')
        .create({
          data: {
            action: `${contentType}.findOne`,
            subject: contentType,
            properties: {},
            conditions: [],
            role: publicRole.id,
          },
        });
    }
  }

  // Set up default permissions for authenticated role
  const authenticatedRole = await strapi
    .query('plugin::users-permissions.role')
    .findOne({ where: { type: 'authenticated' } });

  if (authenticatedRole) {
    // Allow authenticated users to manage their own data
    const studentContentTypes = [
      'api::student.student',
      'api::enrollment.enrollment',
      'api::study-session.study-session',
      'api::todo.todo',
      'api::progress.progress',
    ];

    for (const contentType of studentContentTypes) {
      const actions = ['find', 'findOne', 'create', 'update', 'delete'];
      
      for (const action of actions) {
        await strapi
          .query('plugin::users-permissions.permission')
          .create({
            data: {
              action: `${contentType}.${action}`,
              subject: contentType,
              properties: {},
              conditions: [],
              role: authenticatedRole.id,
            },
          });
      }
    }
  }
};

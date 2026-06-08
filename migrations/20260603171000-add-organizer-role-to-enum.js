'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(
      `ALTER TYPE enum_users_role ADD VALUE IF NOT EXISTS 'ORGANIZER';`
    );
  },

  async down(queryInterface, Sequelize) {
    // Removing a value from an ENUM is not supported directly in PostgreSQL.
    // Down migration is a no-op.
  }
};

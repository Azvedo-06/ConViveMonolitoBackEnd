'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.removeConstraint('users', 'users_phone_key');
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.addConstraint('users', {
      fields: ['phone'],
      type: 'unique',
      name: 'users_phone_key'
    });
  }
};

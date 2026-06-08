'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('events', 'category', {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: 'eventos',
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('events', 'category');
  }
};

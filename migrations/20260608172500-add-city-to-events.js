'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('events', 'city', {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: 'campo-mourao',
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('events', 'city');
  }
};

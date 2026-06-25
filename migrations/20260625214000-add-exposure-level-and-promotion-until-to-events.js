'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('events', 'exposure_level', {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: 'NONE',
    });
    await queryInterface.addColumn('events', 'promotion_until', {
      type: Sequelize.DATE,
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('events', 'exposure_level');
    await queryInterface.removeColumn('events', 'promotion_until');
  },
};

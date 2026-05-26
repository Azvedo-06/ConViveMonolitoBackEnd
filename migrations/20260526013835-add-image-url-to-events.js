'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn(
      'events',
      'image_url',
      {
        type: Sequelize.STRING,
        allowNull: true,
      },
    );
  },

  async down(queryInterface) {
    await queryInterface.removeColumn(
      'events',
      'image_url',
    );
  },
};

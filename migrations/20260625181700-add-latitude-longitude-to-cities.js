'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('cities', 'latitude', {
      type: Sequelize.DECIMAL(10, 8),
      allowNull: true,
    });
    await queryInterface.addColumn('cities', 'longitude', {
      type: Sequelize.DECIMAL(11, 8),
      allowNull: true,
    });

    // Update existing seeded cities with coordinates
    // Campo Mourão: -24.0439, -52.3781
    // Mamborê: -24.3197, -52.7303
    await queryInterface.sequelize.query(
      `UPDATE cities SET latitude = -24.0439, longitude = -52.3781 WHERE id = 'campo-mourao';`
    );
    await queryInterface.sequelize.query(
      `UPDATE cities SET latitude = -24.3197, longitude = -52.7303 WHERE id = 'mambore';`
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('cities', 'latitude');
    await queryInterface.removeColumn('cities', 'longitude');
  },
};

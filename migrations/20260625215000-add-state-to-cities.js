'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('cities', 'state', {
      type: Sequelize.STRING(2),
      allowNull: true,
    });

    // Populate existing seeded cities with 'PR'
    await queryInterface.sequelize.query(
      `UPDATE cities SET state = 'PR' WHERE id IN ('campo-mourao', 'mambore');`
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('cities', 'state');
  },
};

'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('event_participants', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },

      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,

        references: {
          model: 'users',
          key: 'id',
        },

        onDelete: 'CASCADE',
      },

      event_id: {
        type: Sequelize.INTEGER,
        allowNull: false,

        references: {
          model: 'events',
          key: 'id',
        },

        onDelete: 'CASCADE',
      },

      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('NOW()'),
      },

      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('NOW()'),
      },
    });

    await queryInterface.addConstraint(
      'event_participants',
      {
        fields: ['user_id', 'event_id'],
        type: 'unique',
        name: 'unique_user_event_participation',
      },
    );
  },

  async down(queryInterface) {
    await queryInterface.dropTable(
      'event_participants',
    );
  },
};

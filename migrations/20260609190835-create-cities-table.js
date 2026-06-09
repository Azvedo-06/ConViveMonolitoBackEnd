'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('cities', {
      id: {
        type: Sequelize.STRING,
        primaryKey: true,
        allowNull: false,
      },
      label: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      theme: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      accent_class_name: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      image_url: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      image_fallback_url: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      color_primary: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      color_secondary: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      tags: {
        type: Sequelize.JSON,
        allowNull: true,
      },
      spotlight: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
      }
    });

    // Seed initial cities
    await queryInterface.bulkInsert('cities', [
      {
        id: 'campo-mourao',
        label: 'Campo Mourão',
        theme: 'campo-mourao',
        accent_class_name: 'bg-city-campoMourao text-white',
        image_url: '/images/campo-mourao2.jpg',
        image_fallback_url: 'https://images.unsplash.com/photo-1505765050516-f72dcac9c60d?auto=format&fit=crop&w=900&q=80',
        color_primary: '46 125 50',
        color_secondary: '102 187 106',
        description: 'Feiras, cursos rápidos e eventos com forte circulação urbana e público diversificado.',
        tags: JSON.stringify(['cultura', 'cursos', 'eventos gratuitos']),
        spotlight: 'Boa para quem quer alcance maior e variedade de público.',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 'mambore',
        label: 'Mamborê',
        theme: 'mambore',
        accent_class_name: 'bg-city-mambore text-white',
        image_url: '/images/mambore2.jpg',
        image_fallback_url: 'https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=900&q=80',
        color_primary: '216 67 21',
        color_secondary: '255 138 101',
        description: 'Programação comunitária, cursos e atividades mais próximas da rotina local.',
        tags: JSON.stringify(['comunidade', 'atividades', 'agenda local']),
        spotlight: 'Boa para quem quer conversa mais próxima e comunicação local.',
        created_at: new Date(),
        updated_at: new Date()
      }
    ]);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('cities');
  }
};

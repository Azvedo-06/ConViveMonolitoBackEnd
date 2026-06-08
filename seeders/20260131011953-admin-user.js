'use strict';
const bcrypt = require('bcrypt');
// seeder para criar um usuário admin se ele não existir
module.exports = {
  async up (queryInterface) {
    const email = 'admin@convive.com';
    const passwordHash = await bcrypt.hash('admin123', 10);

    const [existingAdmin] = await queryInterface.sequelize.query(
      `SELECT * FROM "users" WHERE email = '${email}' LIMIT 1;`,
      {
        replacements: { email },
        type: queryInterface.sequelize.QueryTypes.SELECT,
      }
    );

    if (existingAdmin) {
      console.log('Admin user já existe. seeder será ignorado.');
      return;
    }

    await queryInterface.bulkInsert('users', [{
      name: 'Admin',
      cpf: '11436436907',
      phone: '43999844167',
      email: email,
      password: passwordHash,
      role: 'ADMIN',
      created_at: new Date(),
      updated_at: new Date(),
    }], {});
    console.log('Admin user criado com sucesso.');
  },
  // Função para reverter o seeder, removendo o usuário admin criado
  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('users', { email: 'admin@convive.com' }, {});  
  }
};

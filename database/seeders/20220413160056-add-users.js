'use strict';
const bcrypt = require("bcrypt");

async function encrypt_password(password) {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt)
}


module.exports = {
  up: async (queryInterface, Sequelize) => queryInterface.bulkInsert('Users', 
    [
      {
        name: 'admin',
        email: 'admin@gmail.com',
        password: await encrypt_password('pizza123'),
        role: 'user,admin',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'user',
        email: 'user@gmail.com',
        password: await encrypt_password('pizza123'),
        role: 'user',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {}),

  down: (queryInterface) => queryInterface.bulkDelete('Users', null, {}),
};
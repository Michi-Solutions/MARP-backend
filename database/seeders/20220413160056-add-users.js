'use strict';
const bcrypt = require("bcrypt");

async function encrypt_password(password) {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt)
}


module.exports = {
  up: async (queryInterface, Sequelize) => queryInterface.bulkInsert('tbl_usuario', 
    [
      {
        nome: 'admin',
        sobrenome: '',
        mail: 'admin@gmail.com',
        senha: await encrypt_password('pizza123'),
        ativo: true,
        data_cadastro: new Date(),
        data_exclusao: null,
        perfil: 'admin',
      },
      {
        nome: 'student',
        sobrenome: '',
        mail: 'student@gmail.com',
        senha: await encrypt_password('pizza123'),
        ativo: true,
        data_cadastro: new Date(),
        data_exclusao: null,
        perfil: 'student',
      },
      {
        nome: 'professor',
        sobrenome: '',
        mail: 'professor@gmail.com',
        senha: await encrypt_password('pizza123'),
        ativo: true,
        data_cadastro: new Date(),
        data_exclusao: null,
        perfil: 'professor',
      },
    ], {}),

  down: (queryInterface) => queryInterface.bulkDelete('tbl_usuario', null, {}),
};
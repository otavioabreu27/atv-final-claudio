const Sequelize = require('sequelize');
const cred = require('../credenciais_db');

const sequelize = new Sequelize(
    cred.nomeBanco, 
    cred.usuario, 
    cred.senha, {
    host: cred.host,
    dialect: cred.dialect,
});

module.exports = sequelize;
const { DataTypes } = require('sequelize');
const database = require('../db');

const Salario = database.define('Salario', {
    salario_minimo: {
        type: DataTypes.FLOAT
      },
});

module.exports = Salario;
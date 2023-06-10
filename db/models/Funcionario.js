const { DataTypes } = require('sequelize');
const database = require('../db');

const Funcionario = database.define('Funcionario', {
  codFunc: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  horasTrabalhadas: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  turno: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  categoria: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  salarioInicial: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
});

module.exports = Funcionario;
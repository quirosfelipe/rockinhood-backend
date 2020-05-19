'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Companies', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING(50),
        allowNull: false
      },
      symbol: {
        type: Sequelize.STRING(5),
        unique: true,
        allowNull: false
      },
      description: {
        type: Sequelize.TEXT
      },
      ceo: {
        type: Sequelize.STRING(50),
        allowNull: false
      },
      employees: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      headquarters: {
        type: Sequelize.STRING(50),
        allowNull: false
      },
      founded: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      marketCap: {
        type: Sequelize.BIGINT,
        allowNull: false
      },
      priceEarningRatio: {
        type: Sequelize.FLOAT(6,2),
        allowNull: false
      },
      dividendYield: {
        type: Sequelize.FLOAT(6,2),
        allowNull: false
      },
      averageVolume: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Companies');
  }
};
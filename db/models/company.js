'use strict';
module.exports = (sequelize, DataTypes) => {
  const Company = sequelize.define('Company', {
    name: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    symbol: {
      type: DataTypes.STRING(5),
      unique: true,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
    },
    ceo: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    employees: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    headquarters: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    founded: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    marketCap: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    priceEarningRatio: {
      type: DataTypes.NUMERIC(6,2),
      allowNull: false
    },
    dividendYield: {
      type: DataTypes.NUMERIC(6,2),
      allowNull: false
    },
    averageVolume: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {});
  Company.associate = function(models) {
    Company.belongsTo(models.Transaction, {
      as: "transaction",
      foreignKey: "companyId",
    });
    Company.belongsTo(models.Watchlist, {
      as: "watchlist",
      foreignKey: "companyId",
    });
  };
  return Company;
};
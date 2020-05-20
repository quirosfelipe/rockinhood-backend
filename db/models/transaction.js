'use strict';
module.exports = (sequelize, DataTypes) => {
  const Transaction = sequelize.define('Transaction', {
    shares: {
       type: DataTypes.INTEGER,
       allowNull: false
    },
    price: {
      type: DataTypes.NUMERIC(10,2),
      allowNull: false
    },
    buySell: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    }
  }, {});
  Transaction.associate = function(models) {
    Transaction.hasOne(models.User, {
      as: "user",
      foreignKey: "userId",
    });
    Transaction.hasOne(models.Company, {
      as: "company",
      foreignKey: "companyId",
    });
  };
  return Transaction;
};
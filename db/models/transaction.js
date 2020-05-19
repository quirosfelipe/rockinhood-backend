'use strict';
module.exports = (sequelize, DataTypes) => {
  const Transaction = sequelize.define('Transaction', {
    shares: {
       type: DataTypes.INTEGER,
       allowNull: false
    },
    price: {
      type: DataTypes.NUMERIC(2),
      allowNull: false
    },
    buySell: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    }
  }, {});
  Transaction.associate = function(models) {
    Transaction.hasOne(models.User, {
      foreignKey: "userId",
    });
    Transaction.hasOne(models.Company, {
      foreignKey: "companyId",
    });
  };
  return Transaction;
};
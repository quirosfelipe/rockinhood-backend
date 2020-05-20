'use strict';
module.exports = (sequelize, DataTypes) => {
  const Watchlist = sequelize.define('Watchlist', {
  }, {});
  Watchlist.associate = function(models) {
    Watchlist.belongsTo(models.User, {
      as: "users",
      foreignKey: "userId",
    });
    Watchlist.hasMany(models.Company, {
      as: "companies",
      foreignKey: "companyId",
    });
  };
  return Watchlist;
};
'use strict';
module.exports = (sequelize, DataTypes) => {
  const Watchlist = sequelize.define('Watchlist', {
  }, {});
  Watchlist.associate = function(models) {
    Watchlist.belongsTo(models.User, {
      as: "user",
      foreignKey: "userId",
    });
    Watchlist.hasMany(models.Company, {
      as: "company",
      foreignKey: "companyId",
    });
  };
  return Watchlist;
};
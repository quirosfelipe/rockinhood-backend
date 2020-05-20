'use strict';
module.exports = (sequelize, DataTypes) => {
  const Watchlist = sequelize.define('Watchlist', {
  }, {});
  Watchlist.associate = function(models) {
    Watchlist.belongsTo(models.User, { foreignKey: "userId" });
    Watchlist.belongsTo(models.Company, { foreignKey: "companyId" });
  };
  return Watchlist;
};
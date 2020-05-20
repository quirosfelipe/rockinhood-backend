'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    fullName: { 
      type: DataTypes.STRING(50),
      allowNull: false
    },
    email: {
      type: DataTypes.STRING(50),
      unique: true,
      allowNull: false
    },
    hashedPassword: {
      type: DataTypes.STRING.BINARY,
      allowNull: false
    },
    cashBalance: {
      type: DataTypes.NUMERIC(12,2),
      allowNull: false
    }
  }, {});
  User.associate = function(models) {
    User.hasMany(models.Transaction, {
      as: "transactions",
      foreignKey: "userId",
    });
    User.hasOne(models.Watchlist, {
      as: "watchlists",
      foreignKey: "userId",
    });
  };

  User.prototype.validatePassword = function (password) {
    return bcrypt.compareSync(password, this.hashedPassword.toString());
  };

  return User;
};
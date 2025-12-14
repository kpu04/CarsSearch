"use strict";
const { Model, DataTypes } = require("sequelize");

class User extends Model {
  static initModel(sequelize) {
    User.init(
      {
        username: { type: DataTypes.STRING, allowNull: false },
        email: { type: DataTypes.STRING, allowNull: false },
        password: { type: DataTypes.STRING, allowNull: false },
        role: { type: DataTypes.ENUM("user", "admin"), defaultValue: "user" },
      },
      {
        sequelize,
        modelName: "User",
        tableName: "User",
        timestamps: false,
      }
    );
    return User;
  }
}

module.exports = User;

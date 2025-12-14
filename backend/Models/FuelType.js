"use strict";
const { Model, DataTypes } = require("sequelize");

class FuelType extends Model {
  static initModel(sequelize) {
    FuelType.init(
      {
        name: {
          type: DataTypes.STRING,
          allowNull: false,
        },
      },
      {
        sequelize,
        modelName: "FuelType",
        tableName: "FuelType",
        timestamps: false,
      }
    );
    return FuelType;
  }
}

module.exports = FuelType;

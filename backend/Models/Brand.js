"use strict";
const { Model, DataTypes } = require("sequelize");

class Brand extends Model {
  static initModel(sequelize) {
    Brand.init(
      {
        name: {
          type: DataTypes.STRING,
          allowNull: false,
        },
      },
      {
        sequelize,
        modelName: "Brand",
        tableName: "Brand",
        timestamps: false,
      }
    );
    return Brand;
  }
}

module.exports = Brand;

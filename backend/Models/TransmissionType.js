"use strict";
const { Model, DataTypes } = require("sequelize");

class TransmissionType extends Model {
  static initModel(sequelize) {
    TransmissionType.init(
      {
        name: {
          type: DataTypes.STRING,
          allowNull: false,
        },
      },
      {
        sequelize,
        modelName: "TransmissionType",
        tableName: "TransmissionType",
        timestamps: false,
      }
    );
    return TransmissionType;
  }
}

module.exports = TransmissionType;

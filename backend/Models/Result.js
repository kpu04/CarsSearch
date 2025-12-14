'use strict';
const { Model, DataTypes } = require('sequelize');

class Result extends Model {
  static initModel(sequelize) {
    Result.init(
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        detectedCarModel: {
          type: DataTypes.STRING,
          allowNull: false,
          validate: {
            notEmpty: {
              msg: 'Model name cannot be empty'
            }
          }
        },
        confidence: {
          type: DataTypes.FLOAT,
          allowNull: false,
          validate: {
            min: 0,
            max: 100
          }
        },
      },
      {
        sequelize,
        modelName: 'Result',
        tableName: 'results',
        timestamps: true,
        createdAt: 'createdAt',
        updatedAt: 'updatedAt'
      }
    );
    return Result;
  }
}

module.exports = Result;
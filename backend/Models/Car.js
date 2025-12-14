// models/car.js
"use strict";
const { Model, DataTypes } = require("sequelize");

class Car extends Model {
  static initModel(sequelize) {
    Car.init(
      {
        model: {
          type: DataTypes.STRING,
          allowNull: false
        },
        year: {
          type: DataTypes.INTEGER,
          allowNull: false
        },
        price: {
          type: DataTypes.DECIMAL(10, 2), 
          allowNull: false
        },
        photo: {
          type: DataTypes.STRING,
          allowNull: true
        },
        description: {
          type: DataTypes.TEXT,
          allowNull: true
        },
        mileage: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 0
        },
        engineVolume: {
          type: DataTypes.FLOAT,
          allowNull: false
        },
        brandId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: "Brand",
            key: "id",
          },
        },
        fuelTypeId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: "FuelType",
            key: "id",
          },
        },
        transmissionId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: "TransmissionType",
            key: "id",
          },
        },
      },
      {
        sequelize,
        modelName: "Car",
        tableName: "Car",
        timestamps: false,
      }
    );
    
    Car.associate = function(models) {
      Car.belongsTo(models.Brand, {
        foreignKey: 'brandId',
        as: 'brand'
      });
      Car.belongsTo(models.FuelType, {
        foreignKey: 'fuelTypeId',
        as: 'fuelType'
      });
      Car.belongsTo(models.TransmissionType, {
        foreignKey: 'transmissionId',
        as: 'transmission'
      });
    };
    
    return Car;
  }
}

module.exports = Car;
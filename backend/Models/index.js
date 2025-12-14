// Models/index.js
'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const process = require('process');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.js')[env];
const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

// Читаем все файлы моделей в директории
fs
  .readdirSync(__dirname)
  .filter(file => {
    return (
      file.indexOf('.') !== 0 &&
      file !== basename &&
      file.slice(-3) === '.js' &&
      file.indexOf('.test.js') === -1
    );
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file));
    if (model.initModel) {
      const initializedModel = model.initModel(sequelize);
      db[initializedModel.name] = initializedModel;
    } else if (model.init) {
      const initializedModel = model.init(sequelize);
      db[initializedModel.name] = initializedModel;
    }
  });

// Теперь все модели загружены, можно настраивать связи

// Получаем модели из db объекта
const { Car, Brand, FuelType, TransmissionType, Review, User, SearchResult } = db;

if (User && Review) {
  // Без псевдонимов
  User.hasMany(Review, { 
    foreignKey: "userId"
  });
  
  Review.belongsTo(User, { 
    foreignKey: "userId"
  });
}

if (Brand && Car) {
  // Один Brand имеет много Car
  Brand.hasMany(Car, { 
    foreignKey: "brandId",
    as: 'cars'
  });
  
  // Одна Car принадлежит одному Brand
  Car.belongsTo(Brand, { 
    foreignKey: "brandId",
    as: 'brand'
  });
}

if (FuelType && Car) {
  // Один FuelType имеет много Car
  FuelType.hasMany(Car, { 
    foreignKey: "fuelTypeId",
    as: 'cars'
  });
  
  // Одна Car принадлежит одному FuelType
  Car.belongsTo(FuelType, { 
    foreignKey: "fuelTypeId",
    as: 'fuelType'
  });
}

if (TransmissionType && Car) {
  // Один TransmissionType имеет много Car
  TransmissionType.hasMany(Car, { 
    foreignKey: "transmissionId",
    as: 'cars'
  });
  
  // Одна Car принадлежит одному TransmissionType
  Car.belongsTo(TransmissionType, { 
    foreignKey: "transmissionId",
    as: 'transmission'
  });
}

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;


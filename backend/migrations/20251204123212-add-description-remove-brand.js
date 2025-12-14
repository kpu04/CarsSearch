// migrations/XXXXXXXXXXXXXX-create-default-records.js

'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // 1. Создаем записи в таблице Brand, если их нет
    const brandsExist = await queryInterface.sequelize.query(
      'SELECT COUNT(*) FROM "Brand"',
      { type: Sequelize.QueryTypes.SELECT }
    );
    
    if (brandsExist[0].count === '0') {
      await queryInterface.bulkInsert('Brand', [
        { id: 1, name: 'Toyota' },
        { id: 2, name: 'Honda' },
        { id: 3, name: 'Ford' },
        { id: 4, name: 'BMW' },
        { id: 5, name: 'Mercedes' }
      ]);
    }

    // 2. Создаем записи в таблице FuelType, если их нет
    const fuelTypesExist = await queryInterface.sequelize.query(
      'SELECT COUNT(*) FROM "FuelType"',
      { type: Sequelize.QueryTypes.SELECT }
    );
    
    if (fuelTypesExist[0].count === '0') {
      await queryInterface.bulkInsert('FuelType', [
        { id: 1, name: 'Petrol' },
        { id: 2, name: 'Diesel' },
        { id: 3, name: 'Electric' },
        { id: 4, name: 'Hybrid' }
      ]);
    }

    // 3. Создаем записи в таблице TransmissionType, если их нет
    const transmissionsExist = await queryInterface.sequelize.query(
      'SELECT COUNT(*) FROM "TransmissionType"',
      { type: Sequelize.QueryTypes.SELECT }
    );
    
    if (transmissionsExist[0].count === '0') {
      await queryInterface.bulkInsert('TransmissionType', [
        { id: 1, name: 'Manual' },
        { id: 2, name: 'Automatic' },
        { id: 3, name: 'CVT' }
      ]);
    }
  },

  async down(queryInterface, Sequelize) {
    // Удаляем созданные записи
    await queryInterface.bulkDelete('Brand', { id: [1, 2, 3, 4, 5] });
    await queryInterface.bulkDelete('FuelType', { id: [1, 2, 3, 4] });
    await queryInterface.bulkDelete('TransmissionType', { id: [1, 2, 3] });
  }
};
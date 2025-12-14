// migrations/XXXXXXXXXXXXXX-fix-car-table-structure.js

'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // 1. Проверяем существующие записи в связанных таблицах
    const [brands] = await queryInterface.sequelize.query(
      'SELECT id FROM "Brand" ORDER BY id LIMIT 1',
      { type: Sequelize.QueryTypes.SELECT }
    );
    
    const [fuelTypes] = await queryInterface.sequelize.query(
      'SELECT id FROM "FuelType" ORDER BY id LIMIT 1',
      { type: Sequelize.QueryTypes.SELECT }
    );
    
    const [transmissions] = await queryInterface.sequelize.query(
      'SELECT id FROM "TransmissionType" ORDER BY id LIMIT 1',
      { type: Sequelize.QueryTypes.SELECT }
    );
    
    const defaultBrandId = brands?.id || 1;
    const defaultFuelTypeId = fuelTypes?.id || 1;
    const defaultTransmissionId = transmissions?.id || 1;

    // 2. Проверяем структуру таблицы Car
    const tableInfo = await queryInterface.describeTable('Car');

    // 3. Добавляем description если ее нет
    if (!tableInfo.description) {
      await queryInterface.addColumn('Car', 'description', {
        type: Sequelize.TEXT,
        allowNull: true
      });
    }

    // 4. Заполняем внешние ключи корректными значениями
    // Если brandId уже существует
    if (tableInfo.brandId) {
      // Устанавливаем дефолтное значение только для NULL
      await queryInterface.sequelize.query(`
        UPDATE "Car" 
        SET "brandId" = ${defaultBrandId}
        WHERE "brandId" IS NULL OR "brandId" NOT IN (SELECT id FROM "Brand")
      `);
    } else {
      // Создаем колонку brandId
      await queryInterface.addColumn('Car', 'brandId', {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: defaultBrandId
      });
    }

    // Аналогично для fuelTypeId
    if (tableInfo.fuelTypeId) {
      await queryInterface.sequelize.query(`
        UPDATE "Car" 
        SET "fuelTypeId" = ${defaultFuelTypeId}
        WHERE "fuelTypeId" IS NULL OR "fuelTypeId" NOT IN (SELECT id FROM "FuelType")
      `);
    } else {
      await queryInterface.addColumn('Car', 'fuelTypeId', {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: defaultFuelTypeId
      });
    }

    // Аналогично для transmissionId
    if (tableInfo.transmissionId) {
      await queryInterface.sequelize.query(`
        UPDATE "Car" 
        SET "transmissionId" = ${defaultTransmissionId}
        WHERE "transmissionId" IS NULL OR "transmissionId" NOT IN (SELECT id FROM "TransmissionType")
      `);
    } else {
      await queryInterface.addColumn('Car', 'transmissionId', {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: defaultTransmissionId
      });
    }

    // 5. Теперь можно добавлять внешние ключи
    // Временно отключаем проверку внешних ключей (если используете PostgreSQL)
    await queryInterface.sequelize.query('SET CONSTRAINTS ALL DEFERRED');

    try {
      await queryInterface.addConstraint('Car', {
        fields: ['brandId'],
        type: 'foreign key',
        name: 'Car_brandId_fkey',
        references: {
          table: 'Brand',
          field: 'id'
        },
        onDelete: 'RESTRICT',
        onUpdate: 'CASCADE'
      });
    } catch (error) {
      console.log('Constraint Car_brandId_fkey might already exist');
    }

    try {
      await queryInterface.addConstraint('Car', {
        fields: ['fuelTypeId'],
        type: 'foreign key',
        name: 'Car_fuelTypeId_fkey',
        references: {
          table: 'FuelType',
          field: 'id'
        },
        onDelete: 'RESTRICT',
        onUpdate: 'CASCADE'
      });
    } catch (error) {
      console.log('Constraint Car_fuelTypeId_fkey might already exist');
    }

    try {
      await queryInterface.addConstraint('Car', {
        fields: ['transmissionId'],
        type: 'foreign key',
        name: 'Car_transmissionId_fkey',
        references: {
          table: 'TransmissionType',
          field: 'id'
        },
        onDelete: 'RESTRICT',
        onUpdate: 'CASCADE'
      });
    } catch (error) {
      console.log('Constraint Car_transmissionId_fkey might already exist');
    }

    // 6. Изменяем тип price на DECIMAL
    if (tableInfo.price) {
      await queryInterface.changeColumn('Car', 'price', {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      });
    }

    // 7. Заполняем и изменяем engineVolume
    if (tableInfo.engineVolume) {
      await queryInterface.sequelize.query(`
        UPDATE "Car" 
        SET "engineVolume" = COALESCE("engineVolume", 2.0)
      `);
      
      await queryInterface.changeColumn('Car', 'engineVolume', {
        type: Sequelize.FLOAT,
        allowNull: false
      });
    }

    // 8. Заполняем и изменяем mileage
    if (tableInfo.mileage) {
      await queryInterface.sequelize.query(`
        UPDATE "Car" 
        SET mileage = COALESCE(mileage, 0)
      `);
      
      await queryInterface.changeColumn('Car', 'mileage', {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      });
    }

    // 9. Удаляем старую колонку brand если она есть
    if (tableInfo.brand) {
      // Если есть данные в brand, можно попытаться сохранить их
      // Создаем новые бренды из уникальных значений
      await queryInterface.sequelize.query(`
        INSERT INTO "Brand" (name)
        SELECT DISTINCT brand
        FROM "Car"
        WHERE brand IS NOT NULL
        AND NOT EXISTS (SELECT 1 FROM "Brand" WHERE "Brand".name = "Car".brand)
        ON CONFLICT DO NOTHING
      `);
      
      // Обновляем brandId на основе имени бренда
      await queryInterface.sequelize.query(`
        UPDATE "Car" 
        SET "brandId" = "Brand".id
        FROM "Brand"
        WHERE "Car".brand = "Brand".name
        AND "Car".brand IS NOT NULL
      `);
      
      // Удаляем колонку brand
      await queryInterface.removeColumn('Car', 'brand');
    }

    // 10. Удаляем другие старые колонки
    const oldColumns = ['brandName', 'fuel', 'transmission'];
    for (const column of oldColumns) {
      if (tableInfo[column]) {
        try {
          await queryInterface.removeColumn('Car', column);
        } catch (error) {
          console.log(`Could not remove column ${column}`);
        }
      }
    }
  },

  async down(queryInterface, Sequelize) {
    // Откат
    const tableInfo = await queryInterface.describeTable('Car');
    
    // Восстанавливаем старые колонки
    await queryInterface.addColumn('Car', 'brand', {
      type: Sequelize.STRING,
      allowNull: true
    });
    
    // Удаляем внешние ключи
    try {
      await queryInterface.removeConstraint('Car', 'Car_brandId_fkey');
      await queryInterface.removeConstraint('Car', 'Car_fuelTypeId_fkey');
      await queryInterface.removeConstraint('Car', 'Car_transmissionId_fkey');
    } catch (error) {}
    
    // Удаляем новые колонки
    await queryInterface.removeColumn('Car', 'description');
    await queryInterface.removeColumn('Car', 'brandId');
    await queryInterface.removeColumn('Car', 'fuelTypeId');
    await queryInterface.removeColumn('Car', 'transmissionId');
    
    // Возвращаем старый тип price
    await queryInterface.changeColumn('Car', 'price', {
      type: Sequelize.DOUBLE,
      allowNull: true
    });
  }
};
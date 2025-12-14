// В папке migrations/XXXXXXXXXXXXXX-create-results.js
'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('results', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      imageUrl: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      detectedCarModel: {
        type: Sequelize.STRING,
        allowNull: false
      },
      confidence: {
        type: Sequelize.FLOAT,
        allowNull: false
      }
    });

  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('results');
  }
};
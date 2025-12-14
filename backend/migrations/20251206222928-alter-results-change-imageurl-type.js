'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Удаляем колонку imageUrl
    await queryInterface.removeColumn('results', 'imageUrl');
  },

  async down(queryInterface, Sequelize) {
    // Восстанавливаем колонку при откате
    await queryInterface.addColumn('results', 'imageUrl', {
      type: Sequelize.TEXT,
      allowNull: true
    });
  }
};
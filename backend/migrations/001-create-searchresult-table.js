// migrations/create-searchresult-simple.js
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('SearchResult', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      carInfo: {
        type: Sequelize.STRING,
        allowNull: false
      },
      confidence: {
        type: Sequelize.STRING,
        allowNull: false
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('SearchResult');
  }
};
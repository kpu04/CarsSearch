"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("Car", "brandId", {
      type: Sequelize.INTEGER,
      references: { model: "Brand", key: "id" },
      onDelete: "SET NULL",
      onUpdate: "CASCADE",
    });

    await queryInterface.addColumn("Car", "fuelTypeId", {
      type: Sequelize.INTEGER,
      references: { model: "FuelType", key: "id" },
      onDelete: "SET NULL",
      onUpdate: "CASCADE",
    });

    await queryInterface.addColumn("Car", "transmissionId", {
      type: Sequelize.INTEGER,
      references: { model: "TransmissionType", key: "id" },
      onDelete: "SET NULL",
      onUpdate: "CASCADE",
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn("Car", "brandId");
    await queryInterface.removeColumn("Car", "fuelTypeId");
    await queryInterface.removeColumn("Car", "transmissionId");
  }
};

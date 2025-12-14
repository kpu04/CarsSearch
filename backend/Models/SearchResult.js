"use strict";
const { Model, DataTypes } = require("sequelize");

class SearchResult extends Model {
  static initModel(sequelize) {
    SearchResult.init(
      {
        carInfo: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        confidence: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        userId: {
          type: DataTypes.INTEGER,
          allowNull: true, 
        },
      },
      {
        sequelize,
        modelName: "SearchResult",
        tableName: "SearchResults",
        timestamps: true,
      }
    );
    return SearchResult;
  }
}

module.exports = SearchResult;
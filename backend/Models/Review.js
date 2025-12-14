'use strict';
const { Model, DataTypes } = require('sequelize');

class Review extends Model {
  static initModel(sequelize) {
    Review.init(
      {
        coment: {
          type: DataTypes.TEXT,
          allowNull: false,
          validate: {
            len: {
              args: [0, 240],
              msg: 'Комментарий не должен превышать 240 символов.',
            },
          },
        },
        userId: {
          type: DataTypes.INTEGER,
          allowNull: true,
          references: {
            model: 'User',
            key: 'id',
          },
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE',
        },
      },
      {
        sequelize,
        modelName: 'Review',
        tableName: 'Review',
        timestamps: true,
      }
    );
    return Review;
  }
}

module.exports = Review;

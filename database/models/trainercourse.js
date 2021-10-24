"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class TrainerCourse extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      TrainerCourse.belongsTo(models.Trainer, {
        foreignKey: "trainerId",
        onDelete: " CASCADE",
      });
      TrainerCourse.belongsTo(models.Course, {
        foreignKey: "courseId",
        onDelete: " CASCADE",
      });
    }
  }
  TrainerCourse.init(
    {
      trainerId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
      },
      courseId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
      },
    },
    {
      sequelize,
      modelName: "TrainerCourse",
    }
  );
  return TrainerCourse;
};

"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Trainee extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Trainee.init(
    {
      name: DataTypes.STRING,
      age: DataTypes.INTEGER,
      email: DataTypes.STRING,
      address: DataTypes.STRING,
      dateofbirth: DataTypes.STRING,
      education: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Trainee",
    }
  );
  return Trainee;
};

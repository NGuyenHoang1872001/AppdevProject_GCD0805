"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    queryInterface.addConstraint("Courses", {
      fields: ["categoryId"],
      type: "foreign key",
      name: "custom_fkey_constraint_categoryId",
      references: {
        //Required field
        table: "Categories",
        field: "id",
      },
      onDelete: "cascade",
      onUpdate: "cascade",
    });
  },

  down: async (queryInterface, Sequelize) => {
    queryInterface.removeConstraint(
      "Courses",
      "custom_fkey_constraint_categoryId"
    );
  },
};

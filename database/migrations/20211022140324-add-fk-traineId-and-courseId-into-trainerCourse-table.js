"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return [
      await queryInterface.addConstraint("TrainerCourses", {
        fields: ["trainerId"],
        type: "foreign key",
        name: "custom_fkey_constraint_TrainerId",
        references: {
          //Required field
          table: "Trainers",
          field: "id",
        },
        onDelete: "cascade",
        onUpdate: "cascade",
      }),

      await queryInterface.addConstraint("TrainerCourses", {
        fields: ["courseId"],
        type: "foreign key",
        name: "custom_fkey_constraint_CourseId",
        references: {
          //Required field
          table: "Courses",
          field: "id",
        },
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
    ];
  },

  down: async (queryInterface, Sequelize) => {
    return [
      await queryInterface.removeConstraint(
        "TrainerCourses",
        "custom_fkey_constraint_TrainerId"
      ),

      await queryInterface.removeConstraint(
        "TrainerCourses",
        "custom_fkey_constraint_CourseId"
      ),
    ];
  },
};

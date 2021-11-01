"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert("Accounts", [
      {
        username: "admin1",
        password: "123",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        username: "admin2",
        password: "123",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        username: "admin3",
        password: "123",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  },
};

"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert("Admins", [
      {
        fullname: "Dinh Tran Tien Bao",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        fullname: "Nguyen Viet Huy Hoang",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        fullname: "admin3",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("Admins", {
      [Op.or]: [
        {
          fullname: "Dinh Tran Tien Bao",
        },
        {
          fullname: "Nguyen Viet Huy Hoang",
        },
        {
          fullname: "admin3",
        },
      ],
    });
  },
};

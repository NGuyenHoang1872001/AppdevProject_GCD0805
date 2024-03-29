var express = require("express");
const session = require("express-session");
var router = express.Router();
const database = require("../database/models/index");
const Staff = database.db.Staff;
const Role = database.db.Role;
const Account = database.db.Account;
const Trainer = database.db.Trainer;
const Admin = database.db.Admin;

/* GET Admin Index page. */
router.get("/", async function (req, res, next) {
  try {
    res.render("layouts/master", {
      content: "../admin_view/admin_index",
      sidebar: "../admin_view/sidebar",
      successFlashMessage: req.flash("successFlashMessage"),
      errorFlashMessage: req.flash("errorFlashMessage"),
      name: req.session.user.username,
    });
  } catch (error) {
    console.log(error);
  }
});

/* GET Admin-TrainingStaff index page. */
router.get("/staff", async function (req, res, next) {
  try {
    const staffs = await Staff.findAll();
    console.log("🚀 ~ file: admin.js ~ line 27 ~ staffs", staffs);
    res.render("layouts/master", {
      content: "../admin_view/admin-staff_index",
      sidebar: "../admin_view/sidebar",
      staffs: staffs,
      successFlashMessage: req.flash("successFlashMessage"),
      errorFlashMessage: req.flash("errorFlashMessage"),
      name: req.session.user.username,
    });
  } catch (error) {
    console.log(error);
  }
});

/* GET Admin-Trainer index page. */
router.get("/trainer", async function (req, res, next) {
  try {
    const trainers = await Trainer.findAll();
    res.render("layouts/master", {
      content: "../admin_view/admin-trainer_index",
      sidebar: "../admin_view/sidebar",
      trainers: trainers,
      successFlashMessage: req.flash("successFlashMessage"),
      errorFlashMessage: req.flash("errorFlashMessage"),
      name: req.session.user.username,
    });
  } catch (error) {
    console.log(error);
  }
});

/* ======================== ADMIN ================================= */

/* GET create Admin page. */
router.get("/createAdmin", async function (req, res, next) {
  const role = await Role.findOne({
    where: {
      name: "admin",
    },
  });
  //const name = req.session.user.username;

  res.render("layouts/master", {
    role,
    content: "../admin_view/createAdmin",
    sidebar: "../admin_view/sidebar",
    successFlashMessage: req.flash("successFlashMessage"),
    errorFlashMessage: req.flash("errorFlashMessage"),
    name: req.session.user.username,
  });
});

/* POST add Training Staff page. */
router.post("/addAdmin", async function (req, res, next) {
  const { username, password, fullname, roleId } = req.body;
  try {
    const admin = await Admin.create({
      fullname: fullname,
    });
    if (admin) {
      await Account.create({
        username: username,
        password,
        roleId,
        userId: admin.dataValues.id,
      });
      req.flash(
        "successFlashMessage",
        `Create admin ${admin.fullname} successfully`
      );
    }
    res.redirect("/admin");
  } catch (error) {
    req.flash("errorFlashMessage", error);
    console.log(session);
    console.log(error);
  }
});

/* ======================== TRAINING STAFF ================================= */

/* GET create Training Staff page. */
router.get("/createStaff", async function (req, res, next) {
  const role = await Role.findOne({
    where: {
      name: "trainingStaff",
    },
  });

  res.render("layouts/master", {
    role: role,
    content: "../staff_view/createStaff",
    sidebar: "../admin_view/sidebar",
    successFlashMessage: req.flash("successFlashMessage"),
    errorFlashMessage: req.flash("errorFlashMessage"),
    name: req.session.user.username,
  });
});

/* POST add Training Staff page. */
router.post("/addStaff", async function (req, res, next) {
  const { username, password, fullname, age, email, address, roleId } =
    req.body;
  try {
    const staff = await Staff.create({
      fullname: fullname,
      age: age,
      email: email,
      address: address,
    });
    if (staff) {
      await Account.create({
        username: username,
        password,
        roleId,
        userId: staff.dataValues.id,
      });
      req.flash(
        "successFlashMessage",
        `Create training staff ${staff.fullname} successfully`
      );
    }
    res.redirect("/admin/staff");
  } catch (error) {
    req.flash("errorFlashMessage", error);
    console.log(session);
    console.log(error);
  }
});

/* ===================================== TRAINER ===================================== */

/* GET create Trainer page. */

router.get("/createTrainer", async function (req, res, next) {
  const role = await Role.findOne({
    where: {
      name: "trainer",
    },
  });
  console.log("🚀 ~ file: admin.js ~ line 138 ~ role", role);

  res.render("layouts/master", {
    role: role,
    content: "../trainer_view/createTrainer",
    sidebar: "../admin_view/sidebar",
    successFlashMessage: req.flash("successFlashMessage"),
    errorFlashMessage: req.flash("errorFlashMessage"),
    name: req.session.user.username,
  });
});

/* POST add Trainer page. */

router.post("/addTrainer", async function (req, res, next) {
  const {
    username,
    password,
    fullname,
    specialty,
    age,
    email,
    address,
    roleId,
  } = req.body;
  try {
    const trainer = await Trainer.create({
      fullname: fullname,
      specialty: specialty,
      age: age,
      email: email,
      address: address,
    });
    if (trainer) {
      await Account.create({
        username: username,
        password,
        roleId,
        userId: trainer.dataValues.id,
      });
      req.flash(
        "successFlashMessage",
        `Create trainer ${trainer.fullname} successfully`
      );
    }
    res.redirect("/admin/trainer");
  } catch (error) {
    req.flash("errorFlashMessage", error);
    console.log(session);
    console.log(error);
  }
});

/* ======================== ACCOUNT ================================= */

const getuserByRole = async (roleName, userId) => {
  let user;
  switch (roleName) {
    case "trainingStaff": {
      user = await Staff.findOne({
        where: {
          id: userId,
        },
      });
      return user;
    }

    case "trainer": {
      user = await Trainer.findOne({
        where: {
          id: userId,
        },
      });
      return user;
    }
    default: {
      res.send("error");
    }
  }
};

const getAccountById = async (accountId) => {
  const account = await Account.findOne({
    where: {
      id: accountId,
    },
    include: Role,
  });
  return account;
};

const deteleUserByRole = async (roleName, userId) => {
  let result;
  switch (roleName) {
    case "trainingStaff": {
      result = await Staff.destroy({
        where: {
          id: userId,
        },
      });
      return result;
    }

    case "trainer": {
      await Trainer.destroy({
        where: {
          id: userId,
        },
      });
      return result;
    }
    default: {
      res.send("error");
    }
  }
};

/* GET Admin-trainerAccount index page. */

router.get("/trainerAccount", async function (req, res) {
  try {
    const accounts = await Account.findAll({
      include: Role,
    });

    const trainerAccounts = accounts.filter(
      (account) => account.Role.name === "trainer"
    );

    res.render("layouts/master", {
      trainerAccounts: trainerAccounts,
      content: "../account_view/trainerAccount_index",
      sidebar: "../admin_view/sidebar",
      successFlashMessage: req.flash("successFlashMessage"),
      errorFlashMessage: req.flash("errorFlashMessage"),
      name: req.session.user.username,
    });
  } catch (error) {
    console.log(error);
  }
});

/* Get Admin-staffAccount index page. */

router.get("/staffAccount", async function (req, res) {
  try {
    const accounts = await Account.findAll({
      include: Role,
    });
    const staffAccounts = accounts.filter(
      (account) => account.Role.name === "trainingStaff"
    );
    console.log(req.flash("successFlashMessage"));

    res.render("layouts/master", {
      staffAccounts: staffAccounts,
      content: "../account_view/staffAccount_index",
      sidebar: "../admin_view/sidebar",
      successFlashMessage: req.flash("successFlashMessage"),
      errorFlashMessage: req.flash("errorFlashMessage"),
      name: req.session.user.username,
    });
  } catch (error) {
    console.log(error);
  }
});

/* GET update Training Staff ACCOUNT page. */

router.get("/updateStaff/:updatedId", async function (req, res, next) {
  try {
    const { updatedId } = req.params;
    const staffAccount = await Account.findAll({
      where: {
        id: updatedId,
      },
    });
    const { id, username, password } = staffAccount[0].dataValues;
    console.log("🚀 ~ file: admin.js ~ line 349 ~ trainer", staffAccount);
    res.render("layouts/master", {
      content: "../staff_view/updateStaff",
      sidebar: "../admin_view/sidebar",
      id,
      username,
      password,
      successFlashMessage: req.flash("successFlashMessage"),
      errorFlashMessage: req.flash("errorFlashMessage"),
      name: req.session.user.username,
    });
  } catch (error) {
    console.log(error);
  }
});

router.post("/editStaff", async function (req, res, next) {
  const { id, username, password } = req.body;
  try {
    const updatedStaff = await Account.update(
      {
        username,
        password,
      },
      {
        where: {
          id: id,
        },
      }
    );
    if (updatedStaff) {
      req.flash("successFlashMessage", `Update Staff successfully`);
      res.redirect("/admin/staffAccount");
    }
    req.flash("errorFlashMessage", `Update Staff failed`);
    res.redirect("/admin/staffAccount");
  } catch (error) {
    req.flash("errorFlashMessage", error);
    console.log(error);
  }
});

/* GET update Trainer ACCOUNT page. */

router.get("/updateTrainer/:updatedId", async function (req, res, next) {
  try {
    const { updatedId } = req.params;
    const trainerAccount = await Account.findAll({
      where: {
        id: updatedId,
      },
    });
    const { id, username, password } = trainerAccount[0].dataValues;
    console.log("🚀 ~ file: admin.js ~ line 349 ~ trainer", trainerAccount);
    res.render("layouts/master", {
      content: "../trainer_view/updateTrainer",
      sidebar: "../admin_view/sidebar",
      id,
      username,
      password,
      successFlashMessage: req.flash("successFlashMessage"),
      errorFlashMessage: req.flash("errorFlashMessage"),
      name: req.session.user.username,
    });
  } catch (error) {
    console.log(error);
  }
});

router.post("/editTrainer", async function (req, res, next) {
  const { id, username, password } = req.body;
  try {
    const updatedTrainer = await Account.update(
      {
        username,
        password,
      },
      {
        where: {
          id: id,
        },
      }
    );
    if (updatedTrainer) {
      req.flash("successFlashMessage", `Update trainer successfully`);
      res.redirect("/admin/trainerAccount");
    }
    req.flash("errorFlashMessage", `Update trainer failed`);
    res.redirect("/admin/trainerAccount");
  } catch (error) {
    req.flash("errorFlashMessage", error);
    console.log(error);
  }
});

/* GET view Trainer detail account page. */

router.get("/viewTrainerAccount", async function (req, res, next) {
  try {
    const { id } = req.query;
    const account = await getAccountById(id);
    console.log("🚀 ~ file: admin.js ~ line 382 ~ account", account);

    const user = await getuserByRole(account.Role.name, account.userId);

    const accountDetail = { ...account.dataValues, User: user };

    res.render("layouts/master", {
      content: "../trainer_view/details",
      sidebar: "../admin_view/sidebar",
      accountDetail,
      successFlashMessage: req.flash("successFlashMessage"),
      errorFlashMessage: req.flash("errorFlashMessage"),
      name: req.session.user.username,
    });
  } catch (error) {
    console.log(error);
  }
});

/* GET view Staff detail account page. */

router.get("/viewStaffAccount", async function (req, res, next) {
  try {
    const { id } = req.query;
    const account = await getAccountById(id);

    const user = await getuserByRole(account.Role.name, account.userId);
    const accountDetail = { ...account.dataValues, User: user };
    res.render("layouts/master", {
      content: "../staff_view/details",
      sidebar: "../admin_view/sidebar",
      accountDetail,
      successFlashMessage: req.flash("successFlashMessage"),
      errorFlashMessage: req.flash("errorFlashMessage"),
      name: req.session.user.username,
    });
  } catch (error) {
    console.log(error);
  }
});

/* GET delete staff  account. */

router.get("/deleteStaffAccount", async function (req, res) {
  try {
    const { id } = req.query;
    const account = await getAccountById(id);
    const result = await deteleUserByRole(account.Role.name, account.userId);
    await Account.destroy({
      where: {
        id,
      },
    });

    result
      ? req.flash("successFlashMessage", `Delete staff successfully`)
      : req.flash("errorFlashMessage", `Delete staff failed`);
    res.redirect("/admin/staffAccount");
  } catch (error) {
    console.log(error);
  }
});

/* GET delete TRAINER  account. */

router.get("/deleteTrainerAccount", async function (req, res) {
  try {
    const { id } = req.query;
    const account = await getAccountById(id);
    console.log("🚀 ~ file: admin.js ~ line 315 ~ account", account);

    const result = await deteleUserByRole(account.Role.name, account.userId);
    await Account.destroy({
      where: {
        id,
      },
    });

    result
      ? req.flash("successFlashMessage", `Delete Trainer successfully`)
      : req.flash("errorFlashMessage", `Delete Trainer failed`);
    res.redirect("/admin/trainerAccount");
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;

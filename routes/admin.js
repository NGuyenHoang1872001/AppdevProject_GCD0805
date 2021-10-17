var express = require("express");
const session = require("express-session");
var router = express.Router();
const database = require("../database/models/index");
console.log("🚀 ~ file: admin.js ~ line 5 ~ database", database);
const Staff = database.db.Staff;
const Role = database.db.Role;
const Account = database.db.Account;
const Trainer = database.db.Trainer;

/* GET Admin Index page. */
router.get("/", async function (req, res, next) {
  try {
    res.render("layouts/master", {
      content: "../admin_view/admin_index",
      successFlashMessage: req.flash("successFlashMessage"),
      errorFlashMessage: req.flash("errorFlashMessage"),
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
      staffs: staffs,
      successFlashMessage: req.flash("successFlashMessage"),
      errorFlashMessage: req.flash("errorFlashMessage"),
    });
  } catch (error) {
    console.log(error);
  }
});

/*Get Home page. */
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
      await Trainer.findOne({
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

/*Get Home page. */
router.get("/viewAccount", async function (req, res, next) {
  try {
    const { id } = req.query;

    const account = await Account.findOne({
      where: {
        id,
      },
      include: Role,
    });
    const user = await getuserByRole(account.Role.name, account.userId);
    const accountDetail = { ...account.dataValues, User: user };
    res.send(accountDetail);
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
      trainers: trainers,
      successFlashMessage: req.flash("successFlashMessage"),
      errorFlashMessage: req.flash("errorFlashMessage"),
    });
  } catch (error) {
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
    successFlashMessage: req.flash("successFlashMessage"),
    errorFlashMessage: req.flash("errorFlashMessage"),
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

/* ======================== TRAINER/TRAINING STAFF ACCOUNT ================================= */

/* Get Admin-staffAccount index page. */

router.get("/staffAccount", async function (req, res) {
  try {
    const accounts = await Account.findAll({
      include: Role,
    });
    const staffAccounts = accounts.filter(
      (account) => account.Role.name === "trainingStaff"
    );

    res.render("layouts/master", {
      staffAccounts: staffAccounts,
      content: "../account_view/staffAccount_index",
      successFlashMessage: req.flash("successFlashMessage"),
      errorFlashMessage: req.flash("errorFlashMessage"),
    });
  } catch (error) {
    console.log(error);
  }
});

/* Get Admin-trainerAccount index page. */

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
      successFlashMessage: req.flash("successFlashMessage"),
      errorFlashMessage: req.flash("errorFlashMessage"),
    });
  } catch (error) {
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
    successFlashMessage: req.flash("successFlashMessage"),
    errorFlashMessage: req.flash("errorFlashMessage"),
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
        `Create training staff ${trainer.fullname} successfully`
      );
    }
    res.redirect("/admin/trainer");
  } catch (error) {
    req.flash("errorFlashMessage", error);
    console.log(session);
    console.log(error);
  }
});

module.exports = router;

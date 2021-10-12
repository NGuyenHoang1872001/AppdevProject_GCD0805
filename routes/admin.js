var express = require("express");
const session = require("express-session");
var router = express.Router();
const database = require("../database/models/index");
console.log("🚀 ~ file: admin.js ~ line 5 ~ database", database);
const Staff = database.db.Staff;
const Role = database.db.Role;
const Account = database.db.Account;
const Trainer = database.db.Trainer;
const Trainee = database.db.Trainee;
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

/* GET Admin-Trainee index page. */
router.get("/trainee", async function (req, res, next) {
  try {
    const trainees = await Trainee.findAll();
    res.render("layouts/master", {
      content: "../admin_view/admin-trainee_index",
      trainees: trainees,
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

/* GET Delete Training Staff . */
// router.get("/deleteStaff/:deletedId", async function (req, res, next) {
//   // Delete Trainer base on ID
//   const { deletedId } = req.params;
//   try {
//     const deletedStaff = await Staff.destroy({
//       where: {
//         id: deletedId,
//       },
//     });
//     if (deletedStaff) {
//       req.flash("successFlashMessage", `Delete staff successfully`);
//       res.redirect("/admin/staff");
//     }
//     req.flash("errorFlashMessage", `Delete staff failed`);
//     res.redirect("/admin/staff");
//   } catch (error) {
//     console.log(error);
//   }
// });

/* ======================== TRAINER/TRAINING STAFF ACCOUNT ================================= */

/* Get account index page. */

router.get("/account", async function (req, res) {
  try {
    const accounts = await Account.findAll({
      include: Role,
    });
    console.log("🚀 ~ file: admin.js ~ line 95 ~ accounts", accounts);
    res.render("layouts/master", {
      content: "../account_view/account_index",
      accounts: accounts,
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

/* ======================== TRAINEE================================= */

/* GET create Trainee page. */

router.get("/createTrainee", async function (req, res, next) {
  const role = await Role.findOne({
    where: {
      name: "trainee",
    },
  });
  res.render("layouts/master", {
    role: role,
    content: "../trainee_view/createTrainee",
    successFlashMessage: req.flash("successFlashMessage"),
    errorFlashMessage: req.flash("errorFlashMessage"),
  });
});

/* POST add Trainer page. */

router.post("/addTrainee", async function (req, res, next) {
  const {
    username,
    password,
    name,
    age,
    email,
    address,
    dateofbirth,
    education,
    roleId,
  } = req.body;
  try {
    const trainee = await Trainee.create({
      name: name,
      age: age,
      email: email,
      address: address,
      dateofbirth: dateofbirth,
      education: education,
    });
    if (trainee) {
      await Account.create({
        username: username,
        password,
        roleId,
        userId: trainee.dataValues.id,
      });
      req.flash(
        "successFlashMessage",
        `Create training staff ${trainee.name} successfully`
      );
    }
    res.redirect("/admin/trainee");
  } catch (error) {
    req.flash("errorFlashMessage", error);
    console.log(session);
    console.log(error);
  }
});
module.exports = router;

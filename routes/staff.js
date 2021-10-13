var express = require("express");
const session = require("express-session");
var router = express.Router();
const database = require("../database/models/index");
const Role = database.db.Role;
const Account = database.db.Account;
const Trainee = database.db.Trainee;

/* GET Staff Index page. */
router.get("/", async function (req, res, next) {
  try {
    res.render("layouts/master", {
      content: "../staff_view/staff_index",
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
      content: "../staff_view/staff-trainee_index",
      trainees: trainees,
      successFlashMessage: req.flash("successFlashMessage"),
      errorFlashMessage: req.flash("errorFlashMessage"),
    });
  } catch (error) {
    console.log(error);
  }
});

/* ===================================== Trainee ===================================== */

/* GET create Trainer page. */

router.get("/createTrainee", async function (req, res, next) {
  const role = await Role.findOne({
    where: {
      name: "trainee",
    },
  });
  console.log("🚀 ~ file: admin.js ~ line 138 ~ role", role);

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
        `Create trainee ${trainee.name} successfully`
      );
    }
    res.redirect("/staff/trainee");
  } catch (error) {
    req.flash("errorFlashMessage", error);
    console.log(session);
    console.log(error);
  }
});
module.exports = router;

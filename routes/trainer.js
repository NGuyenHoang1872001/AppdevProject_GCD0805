var express = require("express");
const session = require("express-session");
var router = express.Router();
const database = require("../database/models/index");
const Staff = database.db.Staff;
const Role = database.db.Role;
const Account = database.db.Account;
const Trainer = database.db.Trainer;
const Admin = database.db.Admin;
const Course = database.db.Course;
const Trainee = database.db.Trainee;
const TrainerCourse = database.db.TrainerCourse;
const TraineeCourse = database.db.TraineeCourse;
router.get("/", async function (req, res, next) {
  try {
    const { userId } = req.session.user;
    const trainerCourses = await TrainerCourse.findAll({
      include: Course,
      where: {
        trainerId: userId,
      },
    });

    res.render("layouts/master", {
      content: "../trainer_view/trainer_index",
      successFlashMessage: req.flash("successFlashMessage"),
      errorFlashMessage: req.flash("errorFlashMessage"),
      name: req.session.user.username,
      trainerCourses,
      trainerId: userId,
    });
  } catch (error) {
    console.log(error);
  }
});

router.get("/viewTraineeCourses/:courseId", async (req, res) => {
  const { courseId } = req.params;
  const trainerCourses = await TrainerCourse.findAll({
    include: Trainee,
    where: {
      courseId,
    },
  });
  const traineeCourses = await TraineeCourse.findAll({
    include: Trainee,
    where: {
      courseId,
    },
  });
});

router.get("/updatetrainer/:trainerId", async function (req, res, next) {
  try {
    const { trainerId } = req.params;
    const trainer = await Trainer.findOne({
      where: {
        id: trainerId,
      },
    });

    res.render("layouts/master", {
      content: "../trainer_view/updateTrainerCourse",
      trainer,
      successFlashMessage: req.flash("successFlashMessage"),
      errorFlashMessage: req.flash("errorFlashMessage"),
      name: req.session.user.username,
    });
  } catch (error) {
    console.log(error);
  }
});

router.post("/editTrainer", async function (req, res, next) {
  const { id, fullname, age, specialty, email, address } = req.body;
  try {
    const updatedTrainer = await Trainer.update(
      {
        fullname,
        age,
        specialty,
        email,
        address,
      },
      {
        where: {
          id: id,
        },
      }
    );
    if (updatedTrainer) {
      req.flash("successFlashMessage", `Update Trainer successfully`);
      res.redirect("/trainer");
    }
    req.flash("errorFlashMessage", `Update Trainer failed`);
    res.redirect("/trainer");
  } catch (error) {
    req.flash("errorFlashMessage", error);
    console.log(error);
  }
});

module.exports = router;

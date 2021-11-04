var express = require("express");
const session = require("express-session");
var router = express.Router();
const database = require("../database/models/index");
const Course = database.db.Course;
const Trainee = database.db.Trainee;
const TraineeCourse = database.db.TraineeCourse;
router.get("/", async function (req, res, next) {
  try {
    const { userId } = req.session.user;
    const traineeCourses = await TraineeCourse.findAll({
      include: Course,
      where: {
        traineeId: userId,
      },
    });

    res.render("layouts/master", {
      content: "../trainee_view/trainee_index",
      sidebar: "../trainee_view/sidebar",
      successFlashMessage: req.flash("successFlashMessage"),
      errorFlashMessage: req.flash("errorFlashMessage"),
      name: req.session.user.username,
      traineeCourses,
      traineeId: userId,
    });
  } catch (error) {
    console.log(error);
  }
});

router.get("/viewTraineeProfile/:traineeId", async (req, res) => {
  const { traineeId } = req.params;
  const traineeCourses = await TraineeCourse.findOne({
    include: Trainee,
    where: {
      traineeId,
    },
  });
  res.render("layouts/master", {
    content: "../trainee_view/trainee_profile",
    sidebar: "../trainee_view/sidebar",
    successFlashMessage: req.flash("successFlashMessage"),
    errorFlashMessage: req.flash("errorFlashMessage"),
    name: req.session.user.username,
    traineeCourses,
  });
});

module.exports = router;

var express = require("express");
const session = require("express-session");
var router = express.Router();
const database = require("../database/models/index");
const { Op } = require("sequelize");
const Role = database.db.Role;
const Account = database.db.Account;
const Trainee = database.db.Trainee;
const Trainer = database.db.Trainer;
const Course = database.db.Course;
const Course_Category = database.db.Category;
const TrainerCourse = database.db.TrainerCourse;
const TraineeCourse = database.db.TraineeCourse;

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

/* GET Staff-Trainee index page. */
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

/* GET Course index page. */
router.get("/course", async function (req, res, next) {
  try {
    // Eager Loading - Fetch all associated data
    const courses = await Course.findAll({
      include: Course_Category,
    });
    res.render("layouts/master", {
      content: "../staff_view/staff-course_index",
      courses: courses,
      successFlashMessage: req.flash("successFlashMessage"),
      errorFlashMessage: req.flash("errorFlashMessage"),
    });
  } catch (error) {
    console.log(error);
  }
});

/* GET Category index page. */
router.get("/category", async function (req, res, next) {
  try {
    const categories = await Course_Category.findAll();
    res.render("layouts/master", {
      content: "../staff_view/staff-category_index",
      categories: categories,
      successFlashMessage: req.flash("successFlashMessage"),
      errorFlashMessage: req.flash("errorFlashMessage"),
    });
  } catch (error) {
    console.log(error);
  }
});

/* GET TrainerCourse index page. */
router.get("/trainerCourse", async function (req, res, next) {
  try {
    const trainerCourses = await TrainerCourse.findAll({
      include: [Trainer, Course],
    });
    res.render("layouts/master", {
      content: "../trainerCourse_view/trainerCourse_index",
      trainerCourses: trainerCourses,
      successFlashMessage: req.flash("successFlashMessage"),
      errorFlashMessage: req.flash("errorFlashMessage"),
    });
  } catch (error) {
    console.log(error);
  }
});

/* GET TraineeCourse index page. */
router.get("/traineeCourse", async function (req, res, next) {
  try {
    const traineeCourses = await TraineeCourse.findAll({
      include: [Trainee, Course],
    });
    res.render("layouts/master", {
      content: "../traineeCourse_view/traineeCourse_index",
      traineeCourses: traineeCourses,
      successFlashMessage: req.flash("successFlashMessage"),
      errorFlashMessage: req.flash("errorFlashMessage"),
    });
  } catch (error) {
    console.log(error);
  }
});
/* ===================================== Account ===================================== */

const getuserByRole = async (roleName, userId) => {
  let user;
  switch (roleName) {
    case "trainee": {
      user = await Trainee.findOne({
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
    case "trainee": {
      result = await Trainee.destroy({
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

/* View Trainee Account. */
router.get("/traineeAccount", async function (req, res) {
  try {
    const accounts = await Account.findAll({
      include: Role,
    });

    const traineeAccounts = accounts.filter(
      (account) => account.Role.name === "trainee"
    );

    res.render("layouts/master", {
      traineeAccounts: traineeAccounts,
      content: "../account_view/traineeAccount_index",
      successFlashMessage: req.flash("successFlashMessage"),
      errorFlashMessage: req.flash("errorFlashMessage"),
    });
  } catch (error) {
    console.log(error);
  }
});

/* ===================================== Trainee ===================================== */

/* GET create Trainee page. */

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

/* POST add Trainee page. */

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

router.get("/updateTrainee/:updatedId", async function (req, res) {
  try {
    const { updatedId } = req.params;
    // const account = await Account.findAll();
    const trainee = await Trainee.findOne({
      where: {
        id: updatedId,
      },
    });
    console.log("🚀 ~ file: staff.js ~ line 250 ~ trainee", trainee);

    const traineeAccount = await Account.findOne({
      include: [
        {
          model: Role,
          where: {
            name: "trainee",
          },
        },
      ],
      where: {
        userId: trainee.id,
      },
    });

    const data = { ...trainee, Account: traineeAccount };

    res.send(data);

    // res.render('layouts/master', {
    //   content: "../trainee_view/updateTrainee",
    //   data
    // })
  } catch (error) {
    console.log(error);
  }
});

router.post("/editTrainee", async function (req, res, next) {
  const {
    id,
    username,
    password,
    name,
    age,
    email,
    dateofbirth,
    education,
    createedAt,
    updatedAt,
  } = req.body;
  try {
    const updatedTrainee = await Trainee.update(
      {
        name,
        age,
        email,
        dateofbirth,
        education,
        createedAt,
        updatedAt,
      },
      {
        where: {
          id: id,
        },
      }
    );

    if (updatedTrainee) {
      await Account.update({
        username,
        password,
      });
      req.flash("successFlashMessage", `Update Trainee successfully`);
      res.redirect("/staff/trainee");
    }
    req.flash("errorFlashMessage", `Update Trainee failed`);
    res.redirect("/staff/trainee");
  } catch (error) {
    req.flash("errorFlashMessage", error);
    console.log(error);
  }
});

/* ===================================== Course ===================================== */

/* GET create Course page. */
router.get("/createCourse", async function (req, res, next) {
  const categories = await Course_Category.findAll();
  console.log("🚀 ~ file: staff.js ~ line 139 ~ categories", categories);

  res.render("layouts/master", {
    content: "../course_view/createCourse",
    categories: categories,
    successFlashMessage: req.flash("successFlashMessage"),
    errorFlashMessage: req.flash("errorFlashMessage"),
  });
});

router.post("/addCourse", async function (req, res, next) {
  const { name, descriptions, categoryId } = req.body;
  try {
    const course = await Course.create({
      name: name,
      descriptions: descriptions,
      categoryId: categoryId,
    });
    if (course) {
      req.flash(
        "successFlashMessage",
        `Create Course ${course.name} successfully`
      );
    }
    res.redirect("/staff/course");
  } catch (error) {
    req.flash("errorFlashMessage", error);
    console.log(session);
    console.log(error);
  }
});
/* GET Delete Course */
router.get("/deleteCourse/:deletedId", async function (req, res, next) {
  // Delete course base on ID
  const { deletedId } = req.params;
  try {
    const deletedCourse = await Course.destroy({
      where: {
        id: deletedId,
      },
    });
    if (deletedCourse) {
      req.flash("successFlashMessage", `Delete course successfully`);
      res.redirect("/staff/course");
    }
    req.flash("errorFlashMessage", `Delete course failed`);
    res.redirect("/staff/course");
  } catch (error) {
    console.log(error);
  }
});
/* GET update page. */
router.get("/updateCourse/:updatedId", async function (req, res, next) {
  const { updatedId } = req.params;
  try {
    const categories = await Course_Category.findAll();
    const course = await Course.findAll({
      where: {
        id: updatedId,
      },
    });
    const { id, name, descriptions } = course[0].dataValues;
    res.render("layouts/master", {
      content: "../course_view/updateCourse",
      id: id,
      name: name,
      descriptions: descriptions,
      categories: categories,
      successFlashMessage: req.flash("successFlashMessage"),
      errorFlashMessage: req.flash("errorFlashMessage"),
    });
  } catch (error) {
    console.log(error);
  }
});

router.post("/editCourse", async function (req, res, next) {
  const { id, name, descriptions } = req.body;
  try {
    const updatedCourse = await Course.update(
      {
        name,
        descriptions,
      },
      {
        where: {
          id: id,
        },
      }
    );
    if (updatedCourse) {
      req.flash("successFlashMessage", `Update Course successfully`);
      res.redirect("/staff/course");
    }
    req.flash("errorFlashMessage", `Update Course failed`);
    res.redirect("/staff/course");
  } catch (error) {
    req.flash("errorFlashMessage", error);
    console.log(error);
  }
});

/* ===================================== Category ===================================== */

/* GET create Category */
router.get("/createCategory", function (req, res, next) {
  res.render("layouts/master", {
    content: "../category_view/createCategory",
    successFlashMessage: req.flash("successFlashMessage"),
    errorFlashMessage: req.flash("errorFlashMessage"),
  });
});

router.post("/addCategory", async function (req, res, next) {
  const { name, descriptions } = req.body;
  try {
    const category = await Course_Category.create({
      name: name,
      descriptions: descriptions,
    });
    if (category) {
      req.flash(
        "successFlashMessage",
        `Create Course category ${category.name} successfully`
      );
    }
    res.redirect("/staff/category");
  } catch (error) {
    req.flash("errorFlashMessage", error);
    console.log(session);
    console.log(error);
  }
});

/* GET Delete Category */
router.get("/deleteCategory/:deletedId", async function (req, res, next) {
  // Delete course_Category base on ID
  const { deletedId } = req.params;
  try {
    const deletedCategory = await Course_Category.destroy({
      where: {
        id: deletedId,
      },
    });
    if (deletedCategory) {
      req.flash("successFlashMessage", `Delete Category successfully`);
      res.redirect("/staff/category");
    }
    req.flash("errorFlashMessage", `Delete Category failed`);
    res.redirect("/staff/category");
  } catch (error) {
    console.log(error);
  }
});

/* GET update Category */
router.get("/updateCategory/:updatedId", async function (req, res, next) {
  const { updatedId } = req.params;
  try {
    const category = await Course_Category.findAll({
      where: {
        id: updatedId,
      },
    });
    const { id, name, descriptions } = category[0].dataValues;
    res.render("layouts/master", {
      content: "../category_view/updateCategory",
      id: id,
      name: name,
      descriptions: descriptions,
      successFlashMessage: req.flash("successFlashMessage"),
      errorFlashMessage: req.flash("errorFlashMessage"),
    });
  } catch (error) {
    console.log(error);
  }
});

router.post("/editCategory", async function (req, res, next) {
  const { id, name, descriptions } = req.body;
  try {
    const updatedCategory = await Course_Category.update(
      {
        name,
        descriptions,
      },
      {
        where: {
          id: id,
        },
      }
    );
    if (updatedCategory) {
      req.flash("successFlashMessage", `Update Course Category successfully`);
      res.redirect("/staff/category");
    }
    req.flash("errorFlashMessage", `Update Course Category failed`);
    res.redirect("/staff/category");
  } catch (error) {
    req.flash("errorFlashMessage", error);
    console.log(error);
  }
});

router.get("/deleteTraineeAccount", async function (req, res) {
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
      ? req.flash("successFlashMessage", `Delete Trainee  successfully`)
      : req.flash("errorFlashMessage", `Delete Trainee failed`);
    res.redirect("/staff/traineeAccount");
  } catch (error) {
    console.log(error);
  }
});

/* ===================================== Assign Trainer ===================================== */
router.get("/assignTrainer", async (req, res) => {
  try {
    const trainers = await Trainer.findAll();
    const courses = await Course.findAll();
    res.render("layouts/master", {
      content: "../trainer_view/assignTrainer",
      trainers,
      courses,
      successFlashMessage: req.flash("successFlashMessage"),
      errorFlashMessage: req.flash("errorFlashMessage"),
    });
  } catch (error) {
    console.log(error);
  }
});

router.post("/assignTrainer", async (req, res) => {
  try {
    const { trainerId, courseId } = req.body;
    const result = await TrainerCourse.create({
      trainerId,
      courseId,
    });
    res.redirect("/staff/trainerCourse");
  } catch (error) {
    console.log(error);
  }
});

/* ===================================== Assign Trainee ===================================== */
router.get("/assignTrainee", async (req, res) => {
  try {
    const trainees = await Trainee.findAll();
    const courses = await Course.findAll();
    res.render("layouts/master", {
      content: "../trainee_view/assignTrainee",
      trainees,
      courses,
      successFlashMessage: req.flash("successFlashMessage"),
      errorFlashMessage: req.flash("errorFlashMessage"),
    });
  } catch (error) {
    console.log(error);
  }
});

router.post("/assignTrainee", async (req, res) => {
  try {
    const { traineeId, courseId } = req.body;
    const result = await TraineeCourse.create({
      traineeId,
      courseId,
    });
    res.redirect("/staff/traineeCourse");
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;

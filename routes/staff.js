var express = require("express");
const session = require("express-session");
var router = express.Router();
const database = require("../database/models/index");
const Role = database.db.Role;
const Account = database.db.Account;
const Trainee = database.db.Trainee;
const Course = database.db.Course;
const Course_Category = database.db.Category;

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
module.exports = router;

const express = require("express");
const router = express.Router();
const adminController = require("../controllers/admin");
const common = require("../controllers/common");

router.get("/:adminid/userdata/:userid", adminController.getUserById);
router.get("/:adminid/courseinfo/:courseId", adminController.getCourseInfoById);
router.get("/:adminid/", adminController.getAllUsers);
router.get("/:adminid/allusers/:courseId", adminController.getUserForCourse);
router.get("/:adminid/course/allcourses", adminController.getAllCourses);
router.put("/:adminid/promote/:userid", adminController.addNewUser);
router.get(
    "/:adminid/progress/:employeeid",
    adminController.getProgressByUserId
);
router.patch("/:adminid/updateuserrole", adminController.updateUserRole);
router.post("/:adminid/course/addnewcourse", adminController.addNewCourse);
router.patch(
    "/:adminid/user/data/editprofile",
    adminController.editProfileAdmin
);

module.exports = router;

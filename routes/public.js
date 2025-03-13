var express = require("express");
var router = express.Router();

const file_controller = require("../controllers/fileController");
const user_controller = require("../controllers/userController");

router.get("/", file_controller.list);
router.post("/login", user_controller.login);
router.post("/signup", user_controller.signup);

router.get("/:articleId/comments", file_controller.comment_list);

module.exports = router;

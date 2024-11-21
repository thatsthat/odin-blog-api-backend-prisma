var express = require("express");
var router = express.Router();

const article_controller = require("../controllers/articleController");
const user_controller = require("../controllers/userController");

router.get("/", article_controller.list);
router.post("/login", user_controller.login);
router.post("/signup", user_controller.signup);

router.get("/:articleId/comments", article_controller.comment_list);

module.exports = router;

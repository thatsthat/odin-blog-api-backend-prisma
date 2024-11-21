var express = require("express");
var router = express.Router();

// Require controller modules.
const article = require("../controllers/articleController");

router.get("/", article.list_user);
router.post("/", article.create);
router.patch("/:articleId", article.toggle_published);
router.delete("/:articleId", article.delete);

router.patch("/comments/:articleId", article.comment_create);
router.delete("/comments/:commentId", article.comment_delete);

module.exports = router;

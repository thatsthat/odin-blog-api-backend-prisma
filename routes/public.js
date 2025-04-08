var express = require("express");
var router = express.Router();

const file = require("../controllers/fileController");
const user = require("../controllers/userController");

router.get("/", file.list);
router.post("/login", user.login);
router.post("/signup", user.signup);

module.exports = router;

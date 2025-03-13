var express = require("express");
var router = express.Router();
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

// Require controller modules.
const file = require("../controllers/fileController");

router.get("/:ownerId", file.list);
router.post("/", upload.single("avatar"), file.create);
router.delete("/:fileId", file.delete);

module.exports = router;

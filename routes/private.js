var express = require("express");
var router = express.Router();
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Require controller modules.
const file = require("../controllers/fileController");

router.get("/file/:fileId?", file.info);
router.get("/:parentId?", file.list);
router.post("/file", upload.single("avatar"), file.create);
router.post("/folder", file.createFolder);
router.delete("/:fileId", file.delete);

module.exports = router;

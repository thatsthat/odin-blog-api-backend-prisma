require("@dotenvx/dotenvx").config();
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var bcrypt = require("bcryptjs");
var cors = require("cors");
var publicRouter = require("./routes/public");
var privateRouter = require("./routes/private");
var auth = require("./middleware/auth");

var app = express();
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({ origin: process.env.ORIGIN }));

app.use("/", publicRouter);
app.use("/private", auth.validateToken, privateRouter);

module.exports = app;

const User = require("../models/user");
const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");

// Handle Post create on POST.
exports.signup = [
  // Validate and sanitize fields.
  body("firstName", "Please provide a first name.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("lastName", "Please provide a last name.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("email", "Please provide a valid email address.")
    .trim()
    .isLength({ min: 1 })
    .isEmail()
    .escape(),
  body("email").custom(async (value) => {
    if (value) {
      const user = await User.find({ email: value }).exec();

      if (user.length > 0) {
        throw new Error("Email address already in use");
      }
    }
  }),
  body("password", "Please provide a password.")
    .trim()
    .isLength({ min: 1 })
    .escape(),

  // Process request after validation and sanitization.
  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      // There are errors.
      return res.status(400).json({ error: errors.array()[0].msg });
    } else {
      // Signup data is valid. Proceed with signup
      try {
        bcrypt.hash(req.body.password, 10, async (err, hashedPassword) => {
          const user = new User({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            password: hashedPassword,
            isAdmin: true,
            isWriter: true,
          });
          const result = await user.save();
        });
      } catch (err) {
        return next(err);
      }
    }
  }),
];

exports.login = [
  // Validate and sanitize fields.
  body("email", "Please provide an email and password")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("password", "Please provide an email and password")
    .trim()
    .isLength({ min: 1 })
    .escape(),

  // Process request after validation and sanitization.
  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array()[0].msg });
    } else {
      // Data from form is valid. Proceed with authentication
      next();
    }
  }),
  asyncHandler(async (req, res, next) => {
    try {
      const user = await User.findOne({ email: req.body.email });
      if (!user) {
        return res.status(403).json({ error: "Incorrect username" });
      }
      const match = await bcrypt.compare(req.body.password, user.password);
      if (!match) {
        // passwords do not match!
        return res.status(403).json({ error: "Incorrect password" });
      } else {
        const tokn = jwt.sign(
          { user },
          "iepiep",
          { expiresIn: "3600s" },
          (err, token) => {
            return res.json({
              token,
            });
          }
        );
      }
    } catch (err) {
      return next(err);
    }
  }),
];

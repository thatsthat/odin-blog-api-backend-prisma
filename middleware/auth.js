const jwt = require("jsonwebtoken");

// Verify Token
exports.validateToken = (req, res, next) => {
  const bearerHeader = req.headers["authorization"];
  if (typeof bearerHeader == "undefined") res.sendStatus(403);

  const bearer = bearerHeader.split(" ");
  const token = bearer[1];
  try {
    console.log(token);
    const decode = jwt.verify(token, "iepiep");
    req.user = decode.user;
    next();
  } catch (err) {
    //.redirect("/login_page");
    console.log(err);
    res.sendStatus(403);
  }
};

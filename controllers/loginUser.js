const bcrypt = require("bcrypt");
const User = require("../models/User");

module.exports = (req, res) => {
  const { username, password } = req.body;

  //Find user
  User.findOne({ username: username }, (error, user) => {
    if (user) {
      //User found
      bcrypt.compare(password, user.password, (error, same) => {
        if (same) {
          req.session.userId = user._id;
          console.log("Passwords match");
          res.redirect("/");
        } else {
          console.log("Passwords don't match");

          res.redirect("/auth/login");
        }
      });
    } else {
      console.log("no user found");

      res.redirect("/auth/login");
    }
  });
};

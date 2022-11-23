const User = require("../models/User");
const path = require("path");

module.exports = async (req, res) => {
  try {
    let user = await User.create(req.body);
    res.redirect("/");
  } catch (error) {
    console.log(error);
    const validationErrors = Object.keys(error.errors).map(
      (key) => error.errors[key].message
    );

    req.flash("validationErrors", validationErrors);
    req.flash("data", req.body);

    res.redirect("/auth/register");
  }
};

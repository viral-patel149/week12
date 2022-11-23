const customMiddleWare = (req, res, next) => {
  console.log("Custom Middleware ran!");

  next();
};

module.exports = customMiddleWare;

require("dotenv").config();

const express = require("express");
const expressSession = require("express-session");
const fileUpload = require("express-fileupload");
const ejs = require("ejs");
const app = new express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const flash= require("connect-flash")
const validation = require("./middlewares/validation");
const authMiddleware = require("./middlewares/authMiddleware");
const redirectAuthenticatedMiddleware = require("./middlewares/redirectAuthenticatedMiddleware");
const homeController = require("./controllers/home");
const newPostController = require("./controllers/newPost");
const storePostController = require("./controllers/storePost");
const getPostController = require("./controllers/getPost");
const newUserController = require("./controllers/newUser");
const storeUserController = require("./controllers/storeUser");
const loginController = require("./controllers/login");
const loginUserController = require("./controllers/loginUser");
const logoutController = require("./controllers/logout");

mongoose.connect(process.env.MONGO_URL,
 { useNewUrlParser: true });

app.use(express.static("public"));
app.use(fileUpload());

app.use(
  expressSession({
    secret: "Arbitrary String",
    resave: false,
    saveUninitialized: true,
  })
);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(flash());

app.use("/posts/store", validation.validateMiddleware);

app.set("view engine", "ejs");

global.loggedIn = null;

app.use("*", (req, res, next) => {
  loggedIn = req.session.userId;
  next();
});

app.listen(4000, () => {
  console.log("App listening on port 4000");
});

app.get("/", homeController);

app.get("/posts/new", authMiddleware, newPostController);

app.post("/posts/store", authMiddleware, storePostController);

app.get("/post/:id", getPostController);

app.get("/auth/register", redirectAuthenticatedMiddleware, newUserController);

app.get("/auth/login", redirectAuthenticatedMiddleware, loginController);

app.post(
  "/users/register",
  redirectAuthenticatedMiddleware,
  storeUserController
);

app.post("/users/login", redirectAuthenticatedMiddleware, loginUserController);

app.get("/auth/logout", logoutController);

app.use((req, res) => res.render("notfound"));

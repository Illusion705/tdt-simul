// dependencies
const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");

const configPassport = require("./config/passport");

// models
const Alert = require("./models/Alert");

// create app
const app = express();

// middleware
function checkDeleted(req, res, next) {
  if (req.user && req.user.isDeleted) {
    req.logout();
    res.redirect("/");
  } else {
    next();
  }
}

function checkBanned(req, res, next) {
  const urlStart = req.originalUrl.split("/")[1];
  
  if (req.user && req.user.isBanned && req.originalUrl !== "/banned" && req.originalUrl !== "/logout" && urlStart !== "public" && urlStart !== "api") {
    res.render("banned.ejs");

    Alert.findOne({ id: req.user.notifications[req.user.notifications.length - 1] })
    .then(alert => {
      alert.isSeen = true,
      alert.isConfirmed = true

      alert.save();
    });
  } else {
    next();
  }
}

// app setup
app.set("view-engine", "ejs");

app.use("/public", express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 1000 * 60 * 60 * 24 * 5 } // 5 days
}));
app.use(passport.initialize());
app.use(passport.session());

app.use(checkDeleted);
app.use(checkBanned);

// config passport
configPassport(passport);

// routers
const mainRouter = require("./routes/main");
const apiRouter = require("./routes/api");
const adminRouter = require("./routes/admin");

app.use("/", mainRouter);
app.use("/api", apiRouter);
app.use("/admin", adminRouter);

// 404
function render404(req, res) {
  res
    .status(404)
    .render("404.ejs");
} 

app.use(render404);

// database setup
const port = process.env.PORT || 3001;
const dbString = process.env.DB_STRING;

console.log("Connecting to database...");
mongoose.connect(dbString, () => {
  console.log("Connected to database.");

  // init app
  app.listen(port, () => console.log(`Server listening on port ${port}.`));
});
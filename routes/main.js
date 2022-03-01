// dependencies
const router = require("express").Router();

// routes
router.get("/", (req, res) => {
  if (req.user) {
    res.render("home.ejs");
  } else {
    res.redirect("/login");
  }
});

router.get("/register", (req, res) => {
  if (req.user) {
    res.redirect("/");
  } else {
    res.render("register.ejs");
  }
});

router.get("/login", (req, res) => {
  if (req.user) {
    res.redirect("/");
  } else {
    res.render("login.ejs");
  }
});

// export router
module.exports = router;
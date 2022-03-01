// dependencies
const router = require("express").Router();

// routes
router.get("/", (req, res) => {
  if (req.user) {
    res.redirect("/chat");
  } else {
    res.render("home.ejs");
  }
});

router.get("/register", (req, res) => {
  if (req.user) {
    res.redirect("/chat");
  } else {
    res.render("register.ejs");
  }
});

router.get("/login", (req, res) => {
  if (req.user) {
    res.redirect("/chat");
  } else {
    res.render("login.ejs");
  }
});

router.get("/chat", (req, res) => {
  if (req.user) {
    res.render("chat.ejs");
  } else {
    res.redirect("/login");
  }
})

// export router
module.exports = router;
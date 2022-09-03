// dependencies
const router = require("express").Router();

// routes
router.get("/", (req, res) => {
  if (req.isAuthenticated() && req.user.verificationStatus === "verified") {
    res.redirect("/chat");
  } else {
    res.render("home.ejs");
  }
});

router.get("/register", (req, res) => {
  if (req.isAuthenticated()) {
    if (req.user.verificationStatus === "verified") {
      res.redirect("/chat");
    } else {
      res.redirect("/");
    }
  } else {
    res.render("register.ejs");
  }
});

router.get("/login", (req, res) => {
  if (req.isAuthenticated()) {
    if (req.user.verificationStatus === "verified") {
      res.redirect("/chat");
    } else {
      res.redirect("/");
    }
  } else {
    res.render("login.ejs");
  }
});

router.get("/chat", (req, res) => {
  if (req.isAuthenticated()) {
    if (req.user.verificationStatus === "verified") {
      res.render("chat.ejs");
    } else {
      res.redirect("/");
    }
  } else {
    
    res.redirect("/login");
  }
});

router.get("/contribute", (req, res) => {
  res.render("contribute.ejs");
});

router.get("/logout", (req, res) => {
  req.logout(() => {
    res.redirect("/");
  });
});

// export router
module.exports = router;
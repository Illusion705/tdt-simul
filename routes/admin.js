// dependencies
const router = require("express").Router();

// models

// routes
router.get("/directory", (req, res) => {
  if (req.isAuthenticated() && req.user.adminLevel) {
    res.render("admin-directory.ejs");
  } else {
    res.render("403.ejs");
  }
});

// export router
module.exports = router;
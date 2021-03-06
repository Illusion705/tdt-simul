// dependencies
const router = require("express").Router();

// routes
router.get("/directory", (req, res) => {
  if (req.isAuthenticated() && req.user.adminLevel) {
    res.render("admin-directory.ejs");
  } else {
    res
      .status(403)
      .render("403.ejs");
  }
});

router.get("/account_requests", (req, res) => {
  if (req.isAuthenticated() && req.user.adminLevel) {
    res.render("account-requests.ejs");
  } else {
    res
      .status(403)
      .render("403.ejs");
  }
});

router.get("/account_search", (req, res) => {
  if (req.isAuthenticated() && req.user.adminLevel) {
    res.render("account-search.ejs");
  } else {
    res
      .status(403)
      .render("403.ejs");
  }
});

// export router
module.exports = router;
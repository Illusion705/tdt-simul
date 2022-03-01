// dependencies
const router = require("express").Router();

// models
const User = require("../models/User");

// routes
router.get("/username_status/:username", (req, res) => {
  User.findOne({ username: req.params.username.toLowerCase() })
    .then(user => {
      if (user) {
        res.json({ status: "taken" });
      } else {
        res.json({ status: "available" });
      }
    });
})

// export router
module.exports = router;
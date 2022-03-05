// dependencies
const router = require("express").Router();

// models
const Users = require("../models/Users");

// routes
router.get("/username_status/:username", (req, res) => {
  Users.findOne({ username: req.params.username.toLowerCase() })
    .then(user => {
      if (user) {
        res.json({ status: "taken" });
      } else {
        res.json({ status: "available" });
      }
    });
});

router.post("/register", (req, res) => {
  
});

// export router
module.exports = router;
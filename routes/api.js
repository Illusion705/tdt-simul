// dependencies
const router = require("express").Router();
const bcrypt = require("bcrypt");
  
const verifyRegistryData = require("../config/verify-registry-data");

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
});

router.post("/register", async (req, res) => {
  if (await verifyRegistryData(req.body.username, req.body.firstName, req.body.lastName, req.body.password)) {
    
    const user = new User({
      username: req.body.username.toLowerCase(),
      displayUsername: req.body.username,
      firstName: req.body.firstName,
      lastName: req.body.lastName
    });

    await user.setPassword(req.body.password);
    await user.save();

    await req.login(user, err => {
      if (err) {
        res.json({ status: "failed", reason: "internal server error" });
      } else {
        res.json({ status: "success" });
      }
    });
  } else {
    res.json({ status: "failed", reason: "invalid data" });
  }
});

// export router
module.exports = router;
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
    const password = await bcrypt.hash(req.body.password, 10);
    
    const user = new User({
      username: req.body.username.toLowerCase(),
      displayUsername: req.body.username,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      password: password
    });

    await user.save();
    res.json({ status: "success" });
  } else {
    res.json({ status: "failed" });
  }
});

// export router
module.exports = router;
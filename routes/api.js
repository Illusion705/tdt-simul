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

router.get("/user", async (req, res) => {
  if (req.isAuthenticated()) {
    res.json({
      username: req.user.displayUsername,
      firstName: req.user.firstName,
      lastName: req.user.lastName,
      isAdmin: req.user.isAdmin,
      notificationCount: req.user.notificationCount,
      verificationStatus: req.user.verificationStatus,
      defaultIconColor: req.user.defaultIconColor
    });
  } else {
    res.json({ message: "no user found" });
  }
});

router.post("/register", async (req, res) => {
  if (await verifyRegistryData(req.body.username, req.body.firstName, req.body.lastName, req.body.password)) {
    const defaultIconColor = `rgb(${Math.floor(Math.random() * 70) + 80}, ${Math.floor(Math.random() * 70) + 80}, ${Math.floor(Math.random() * 70) + 80})`;
    
    const user = new User({
      username: req.body.username.toLowerCase(),
      displayUsername: req.body.username,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      defaultIconColor: defaultIconColor
    });

    await user.setPassword(req.body.password);
    await user.save();

    req.login(user, err => {
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

router.post("/login", async (req, res) => {
  if (req.body.username && req.body.password) {
    User.authenticate()(req.body.username.toLowerCase(), req.body.password)
      .then(({ user }) => {
        if (user) {
          req.login(user, err => {
            if (err) {
              res.json({ status: "failed", reason: "internal server error" });
            } else {
              res.json({ status: "success" });
            }
          });
        } else {
          res.json({ status: "failed", reason: "invalid username or password" });
        }
      });
  } else {
    res.json({ status: "failed", reason: "invalid data" });
  }
});

// export router
module.exports = router;
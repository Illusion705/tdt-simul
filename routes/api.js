// dependencies
const router = require("express").Router();
  
const verifyRegistryData = require("../lib/verify-registry-data");
const createAlert = require("../lib/create-alert");

// models
const User = require("../models/User");
const Alert = require("../models/Alert");
const UnbanRequest = require("../models/Unban-Request");

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
      adminLevel: req.user.adminLevel,
      notificationCount: req.user.notificationCount,
      verificationStatus: req.user.verificationStatus,
      defaultIconColor: req.user.defaultIconColor,
      isBanned: req.user.isBanned
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
        if (user && !user.isDeleted) {
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

router.get("/ban_info", (req, res) => {
  if (req.isAuthenticated()) {
    if (req.user.isBanned) {
      res.json({
        banReason: req.user.banReason,
        banExpiration: req.user.banExpiration
      });
    } else {
      res.json({ message: "user not banned" });
    }
  } else {
    res.json({ message: "no user found" });
  }
});

router.get("/notifications", async (req, res) => {
  if (req.isAuthenticated()) {
    const user = req.user;
    let notifications = [];

    for (let i = 0; i < user.notifications.length; i++) {
      const notificationInfo = user.notifications[i];

      if (notificationInfo.notifType === "alert") {
        await Alert.findOne({ id: notificationInfo.id })
          .then(alert => {
            notifications.push({
              type: "alert",
              id: alert.id,
              date: alert.date,
              message: alert.message,
              isSeen: alert.isSeen,
              isUserConfirmed: alert.isUserConfirmed
            });
          });
      }
    }
  
    res.json(notifications);
  } else {
    res.json({ message: "no user found" });
  }
});

router.post("/alert", async (req, res) => {
  if (req.isAuthenticated() && req.user.adminLevel && !req.user.isBanned && !req.user.isDeleted) {
    // create alert
    if (await createAlert(req.body.message, req.body.username) === "success") {
      // return successful
      res.json({status: "success" });
    } else {
      // return error
      res.json({ status: "failed", reason: "invalid user" });
    }
  } else {
    res.json({ status: "failed", message: "action prohibited" });
  }
});

router.post("/ban", async (req, res) => {
  if (req.isAuthenticated() && req.user.adminLevel && !req.user.isBanned && !req.user.isDeleted) {
    if (req.body.banReason) {
      // create alert
      if (await createAlert(req.body.banReason, req.body.username) !== "success") {
        // return error
        res.json({ status: "failed", reason: "invalid user"
        });
      }
    } 

    // ban user
    User.findOne({ username: req.body.username.toLowerCase() })
      .then(async user => {
        if (user) {
          user.isBanned = true;

          if (req.body.banReason) {
            user.banReason = req.body.banReason;
          } else if (user.banReason) {
            delete user.banReason;
          }
          
          user.banExpiration = req.body.banExpiration;
  
          await user.save();
  
          // return successful
          res.json({ status: "success" });
        } else {
          // return error
          res.json({ status: "failed", reason: "invalid user" });
        }
      });
  } else {
    res.json({ status: "failed", reason: "action prohibited" });
  }
});

router.post("/unban_request", async (req, res) => {
  if (req.isAuthenticated() && req.user.isBanned && !req.user.isDeleted) {
    if (req.body.message) {
      const unbanRequest = new UnbanRequest({
        username: req.user.username,
        message: req.body.message
      });

      await unbanRequest.save();

      res.json({ status: "success" });
    } else {
      res.json({ status: "failed", reason: "no message provided" });
    }
  } else {
    res.json({ status: "failed", reason: "action prohibited" });
  }
});

router.get("/account_requests", (req, res) => {
  if (req.isAuthenticated() && req.user.adminLevel && !req.user.isBanned && !req.user.isDeleted) {
    User.find({ verificationStatus: "pending" })
      .then(users => {
        let data = [];

        for (let i = 0; i < users.length; i++) {
          if (!users[i].isDeleted && !users[i].isBanned) {
            data.push({
              username: users[i].displayUsername,
              firstName: users[i].firstName,
              lastName: users[i].lastName,
              dateCreated: users[i].dateCreated
            });
          }
        };
        
        res.json(data);
      });
  } else {
    res.json({ message: "access denied" });
  }
});

router.post("/verification_status", (req, res) => {
  if (req.isAuthenticated() && req.user.adminLevel && !req.user.isBanned && !req.user.isDeleted) {
    User.findOne({ username: req.body.username })
      .then(async user => {
        if (user) {
          if (["pending", "verified", "declined"].includes(req.body.verificationStatus)) {
            user.verificationStatus = req.body.verificationStatus;
            await user.save();

            res.json({ status: "success" });
          } else {
            res.json({ status: "failed", reason: "invalid status" });
          }
        } else {
          res.json({ status: "failed", reason: "invalid user" });
        }
      });
  } else {
    res.json({ status: "failed", reason: "action prohibited" });
  }
});

// export router
module.exports = router;
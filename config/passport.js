// models
const User = require("../models/User");

// config passport
function configPassport(passport) {
  passport.use(User.createStrategy());
  passport.serializeUser(User.serializeUser());
  passport.deserializeUser(User.deserializeUser());
}

// export
module.exports = configPassport;
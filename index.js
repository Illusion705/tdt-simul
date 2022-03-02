// dependencies
const express = require("express");
const path = require("path");
const mongoose = require("mongoose");

// create app
const app = express();

// app setup
app.set("view-engine", "ejs");

app.use("/public", express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// routers
const mainRouter = require("./routes/main");
const apiRouter = require("./routes/api");

app.use("/", mainRouter);
app.use("/api", apiRouter);

// database setup
const port = process.env.PORT || 3001;
const dbString = process.env.DB_STRING;

console.log("Connecting to database...");
mongoose.connect(dbString, () => {
  console.log("Connected to database.");

  // init app
  app.listen(port, () => console.log(`Server listening on port ${port}`));
});
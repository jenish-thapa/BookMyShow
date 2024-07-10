const express = require("express");
const User = require("../models/userModel");

const router = express.Router();

router.post("/register", async (req, res) => {
  // const {name, email, password, }
  await User.create(req.body);
  return res.redirect("/");
});

router.post("/login", async (req, res) => {});

module.exports = router;

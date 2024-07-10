const express = require("express");
const User = require("../models/userModel");

const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const newUser = new User(req.body);
    await newUser.save();
    res.status(201).json("User created");
  } catch (error) {
    res.json(error);
  }
});

router.post("/login", async (req, res) => {});

module.exports = router;

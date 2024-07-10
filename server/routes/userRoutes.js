const express = require("express");
const User = require("../models/userModel");

const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const userExists = await User.findOne({ email: req.body.email });

    if (userExists) {
      res.json("User already exists");
    } else {
      const newUser = new User(req.body);
      await newUser.save();
      res.status(201).json("User created");
    }
  } catch (error) {
    res.json(error);
  }
});

router.post("/login", async (req, res) => {
  const {email, password} = req.body;
  const result = await User.matchPassword(email, password);
  if (result.error) {
    return res.status(400).json(result);
  }
  res.send(result);
});

module.exports = router;

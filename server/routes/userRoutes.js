const express = require("express");
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");

const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const userExists = await User.findOne({ email: req.body.email });

    if (userExists) {
      res.json("User already exists");
    } else {
      const newUser = new User(req.body);
      await newUser.save();
      res.send({
        success: true,
        message: "User created successfully!!",
      });
    }
  } catch (error) {
    res.json(error);
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const result = await User.matchPassword(email, password);
  if (result.error) {
    return res.send({ success: false, error: "Incorrect password or email" });
  }
  const token = jwt.sign({ email: email }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
  res.send({ success: true, message: "User loggedin", token: token });
  
});

module.exports = router;

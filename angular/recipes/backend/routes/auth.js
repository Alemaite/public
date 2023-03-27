const User = require("../models/user");
const bcrypt = require("bcrypt");

const express = require("express");

const router = express.Router();

router.get("", (req, res, next) => {
  User.findOne({ name: req.body.name, isAdmin: true }).then((user) => {
    console.log(user);
  });
});

router.post("", (req, res, next) => {
  User.findOne({ name: req.body.name }).then((user) => {
    if (user) {
      return res.status(409).json({ message: "User already exists" });
    }
    bcrypt.hash(req.body.password, 10).then((hash) => {
      const user = new User({ name: req.body.name, password: hash });
      try {
        user.save().then((user) => {
          res.status(201).json({ message: "User created, please login", user });
        });
      } catch {
        res
          .status(500)
          .json({ message: "Internal server error when creating user" });
      }
    });
  });
});

router.post("/login", (req, res, next) => {
  User.findOne({ name: req.body.name }).then((user) => {
    if (user) {
      return bcrypt
        .compare(req.body.password, user.password)
        .then((comparison) => {
          if (comparison) {
            res.status(200).json({ message: "User logged in", user: user });
          }
          if (!comparison) {
            res.status(401).json({ message: "Authentication failed" });
          }
        });
    }
    if (!user) {
      res.status(404).json({ message: "User not found" });
    }
  });
});

module.exports = router;

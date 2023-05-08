const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const Activity = require("./models/activity");
const bcrypt = require("bcryptjs");
const User = require("./models/user");

const app = express();

mongoose
  .connect(
    "mongodb+srv://TOKENREMOVED@cluster0.7l41bhv.mongodb.net/time-tracking?retryWrites=true&w=majority"
  )
  .then(() => {
    console.log("Connected to DB.");
  })
  .catch(() => {
    console.log("Error connecting to DB.");
  });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, PUT, DELETE, OPTIONS"
  );
  next();
});

// app.get("/", (req, res, next) => {
//   try {
//     res.status(200).json({ message: "Request received from API." });
//   } catch {
//     res.status(500).json({ message: "Internal server errror." });
//   }
// });

app.get("/api/activities/:userId", (req, res, next) => {
  if (req.query.page > 0) {
    Activity.find({ userId: req.params.userId })
      .sort({ date: -1 })
      .skip(+req.query.items * +req.query.page)
      .limit(+req.query.items)
      .then((result) => {
        try {
          res.status(200).json(result);
        } catch {
          res.status(500).json({ message: "Internal server error." });
        }
      });
    return;
  }
  Activity.find({ userId: req.params.userId })
    .sort({ date: -1 })
    .limit(+req.query.items)
    .then((result) => {
      try {
        res.status(200).json(result);
      } catch {
        res.status(500).json({ message: "Internal server error." });
      }
    });
});

app.post("/api/activities/delete", (req, res, next) => {
  Activity.deleteOne({ _id: req.body.actId })
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((error) => {
      res.status(500).json({ message: "Internal server error." });
    });
});

app.post("/api/activities", (req, res, next) => {
  const activity = new Activity({
    userId: req.body.userId,
    user: req.body.user,
    activity: req.body.activity,
    from: req.body.from,
    to: req.body.to,
    time: req.body.time,
    date: req.body.date,
    displayDate: req.body.displayDate,
  });
  activity
    .save()
    .then(() => {
      res.status(201).json({ message: "Activity saved in db." });
    })
    .catch((error) => {
      res.status(500).json({ message: "Internal server error." });
    });
});

app.post("/api/users/register", (req, res, next) => {
  User.findOne({ email: req.body.email })
    .then((fetchedUser) => {
      if (fetchedUser) {
        return res.status(400).json({ message: "User exists already." });
      }
      return bcrypt
        .hash(req.body.password, 10)
        .then((hash) => {
          const user = new User({
            email: req.body.email,
            password: hash,
          });
          return user
            .save()
            .then(
              res
                .status(201)
                .json({ message: "Success! Switch mode below to log in." })
            )
            .catch((error) => {
              res.status(500).json({ message: "Internal server error." });
            });
        })
        .catch((error) => {
          res.status(500).json({ message: "Internal server error." });
        });
    })
    .catch((error) => {
      res.status(500).json({ message: "Internal server error." });
    });
});

app.post("/api/users/login", (req, res, next) => {
  User.findOne({ email: req.body.email })
    .then((fetchedUser) => {
      if (fetchedUser) {
        return bcrypt
          .compare(req.body.password, fetchedUser.password)
          .then((result) => {
            if (result) {
              return res.status(200).json({
                message: "Login successfull.",
                email: fetchedUser.email,
                _id: fetchedUser._id,
              });
            }
            if (!result) {
              return res.status(401).json({ message: "Password is wrong." });
            }
          })
          .catch((error) => {
            res.status(500).json({ message: "Internal server error." });
          });
      }
      if (!fetchedUser) {
        return res.status(404).json({ message: "User not registered." });
      }
    })
    .catch((error) => {
      res.status(500).json({ message: "Internal server error." });
    });
});

module.exports = app;

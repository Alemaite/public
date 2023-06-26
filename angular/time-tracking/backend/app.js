const express = require("express");
const session = require("express-session");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const mongodbStoreSession = require("connect-mongodb-session");
const MongoDBStoreSession = mongodbStoreSession(session);
const bcrypt = require("bcryptjs");
// Models
const Activity = require("./models/activity");
const User = require("./models/user");
const Session = require("./models/session");

const app = express();
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

app.use(cors({ origin: ["https://iu-time-tracking.click"], credentials: true }));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

mongoose
  .connect(
    "REMOVED"
  )
  .then(() => {
    console.log("Connected to DB.");
  })
  .catch(() => {
    console.log("Error connecting to DB.");
  });

const storeSession = new MongoDBStoreSession({
  uri: "REMOVED",
  collection: "sessions",
});

app.use(
  session({
    secret: "REMOVED",
    resave: false,
    saveUninitialized: false,
    store: storeSession,
  })
);

// REST API

// requests when not logged in (session)

app.get("/api/activities/", (req, res, next) => {
  if (!req.session.activities) {
    req.session.activities = [];
  }

  if (req.query.page > 0) {
    Session.aggregate([
      { $match: { _id: req.sessionID } },
      { $unwind: "$session.activities" },
      { $replaceRoot: { newRoot: "$session.activities" } },
    ])
      .sort({ date: -1 })
      .skip(+req.query.items * +req.query.page)
      .limit(+req.query.items)
      .then((result) => {
        try {
          res.status(200).json(result);
        } catch {
          res.status(500).json({
            message:
              "Server error when responding with activity data (session)",
          });
        }
      });
    return;
  }

  if (req.query.items) {
    Session.aggregate([
      { $match: { _id: req.sessionID } },
      { $unwind: "$session.activities" },
      { $replaceRoot: { newRoot: "$session.activities" } },
    ])
      .sort({ date: -1 })
      .limit(+req.query.items)
      .then((result) => {
        try {
          res.status(200).json(result);
        } catch {
          res.status(500).json({
            message:
              "Server error when responding with activity data (session)",
          });
        }
      });
    return;
  }

  // request below to return items when request is sent without query params (without limiting amount of returned items)

  Session.aggregate([
    { $match: { _id: req.sessionID } },
    { $unwind: "$session.activities" },
    { $replaceRoot: { newRoot: "$session.activities" } },
  ])
    .sort({ date: -1 })
    .then((result) => {
      try {
        res.status(200).json(result);
      } catch {
        res.status(500).json({
          message: "Server error when responding with activity data (session)",
        });
      }
    });
});

// requests when logged in

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

  if (req.query.items) {
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
    return;
  }

  // request below to return items when request is sent without query params (without limiting amount of returned items)

  Activity.find({ userId: req.params.userId })
    .sort({ date: -1 })
    .then((result) => {
      try {
        res.status(200).json(result);
      } catch {
        res.status(500).json({ message: "Internal server error." });
      }
    });
});

app.post("/api/activities/delete", (req, res, next) => {
  if (req.body.actId) {
    Activity.deleteOne({ _id: req.body.actId }).then((result) => {
      try {
        res.status(200).json(result);
      } catch {
        res
          .status(500)
          .json({ message: "Internal server error deleting item (logged in)." });
      }
    });
    return;
  }

  Session.updateOne(
    { _id: req.sessionID },
    { $pull: { "session.activities": { date: req.body.date } } }
  ).then((result) => {
    try {
      res.status(200).json(result);
    } catch {
      res
        .status(500)
        .json({ message: "Internal server error deleting item (session)." });
    }
  });
});

app.post("/api/activities", (req, res, next) => {
  if (req.body.userId) {
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
        res.status(201).json({ message: "Activity saved in db (logged in)." });
      })
      .catch((error) => {
        res.status(500).json({
          message:
            "Internal server error when saving activity in db (logged in).",
        });
      });
    return;
  }

  const activity = {
    activity: req.body.activity,
    from: req.body.from,
    to: req.body.to,
    time: req.body.time,
    date: req.body.date,
    displayDate: req.body.displayDate,
  };

  // if (req.session.activities === undefined) {
  //   req.session.activities = [];
  // }

  req.session.activities.push(activity);

  try {
    res.status(201).json({ message: "Activity saved in db (session)." });
  } catch {
    res.status(500).json({
      message: "Internal server error when saving activity in db (session).",
    });
  }
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

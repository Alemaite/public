const mongoose = require("mongoose");

const activitySchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  user: { type: String },
  activity: { type: String, required: true },
  from: { type: String, required: true },
  to: { type: String, required: true },
  time: { type: String, required: true },
  date: { type: Date, required: true },
  displayDate: { type: String, required: true },
});

module.exports = mongoose.model("Activity", activitySchema);

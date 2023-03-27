const mongoose = require("mongoose");

const activitySchema = mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  user: { type: String, required: true },
  activity: { type: String, required: true },
  from: { type: String, required: true },
  to: { type: String, required: true },
  time: { type: String, required: true },
  date: { type: Date, required: true },
  displayDate: { type: String, required: true },
});

module.exports = mongoose.model("Activity", activitySchema);

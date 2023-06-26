const mongoose = require("mongoose");

const sessionSchema = mongoose.Schema({
  _id: { type: String },
  expires: { type: String },
  session: { type: { activities: { type: [Object] } } },
});

module.exports = mongoose.model("Session", sessionSchema);

const mongoose = require("mongoose");

const workLogSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  startTime: Date,
  endTime: Date
});

module.exports = mongoose.model("WorkLog", workLogSchema);
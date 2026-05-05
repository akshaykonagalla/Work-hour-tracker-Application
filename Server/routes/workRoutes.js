const auth = require("../middleware/auth");
const express = require("express");
const router = express.Router();

const WorkLog = require("../models/WorkLog");

// Start work
router.post("/start", auth, async (req, res) => {
  const log = new WorkLog({
    userId: req.userId,   // 🔥 IMPORTANT
    startTime: new Date()
  });

  await log.save();
  res.json(log);
});

// End work
router.post("/end/:id", async (req, res) => {
  const log = await WorkLog.findById(req.params.id);
  log.endTime = new Date();
  await log.save();
  res.json(log);
});

// Get all logs
router.get("/", auth, async (req, res) => {
  const logs = await WorkLog.find({ userId: req.userId });
  res.json(logs);
});

// ✅ VERY IMPORTANT (THIS LINE)
module.exports = router;
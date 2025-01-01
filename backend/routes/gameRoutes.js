const express = require("express");
const { saveScore, getLeaderboard } = require("../controllers/gameController");
const router = express.Router();

router.post("/score", saveScore);
router.get("/leaderboard", getLeaderboard);

module.exports = router;

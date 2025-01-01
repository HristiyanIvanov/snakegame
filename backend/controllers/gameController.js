const db = require("../config/db");

exports.saveScore = (req, res) => {
  const { username, score } = req.body;
  const query = "INSERT INTO leaderboard (username, score) VALUES (?, ?)";
  db.query(query, [username, score], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(200).json({ message: "Score saved successfully!" });
  });
};

exports.getLeaderboard = (req, res) => {
  const query =
    "SELECT username, score FROM leaderboard ORDER BY score DESC LIMIT 10";
  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(200).json(results);
  });
};

const express = require('express');
const router = express.Router();
const db = require('../db');

// GET /api/games?status=final|scheduled
router.get('/', async (req, res) => {
  const { status } = req.query;
  try {
    let query = `
      SELECT g.id, g.game_date, g.home_score, g.away_score, g.status,
             t1.name as home_team, t2.name as away_team
      FROM games g
      JOIN teams t1 ON g.home_team_id = t1.id
      JOIN teams t2 ON g.away_team_id = t2.id
    `;
    const params = [];
    if (status) {
      query += ' WHERE g.status = ?';
      params.push(status);
    }
    query += ' ORDER BY g.game_date DESC';
    const [rows] = await db.query(query, params);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/', async (req, res) => {
  const { status } = req.query;
  try {
    let query = `
      SELECT g.ID_partita as id, g.Data as game_date, 
             g.pt_casa as home_score, g.pt_ospite as away_score, g.status,
             t1.Nome as home_team, t2.Nome as away_team
      FROM partita g
      JOIN squadra t1 ON g.ID_casa = t1.ID_squadra
      JOIN squadra t2 ON g.ID_ospite = t2.ID_squadra
    `;
    const params = [];
    if (status) {
      query += ' WHERE g.status = ?';
      params.push(status);
    }
    query += ' ORDER BY g.Data DESC';
    const [rows] = await db.query(query, params);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
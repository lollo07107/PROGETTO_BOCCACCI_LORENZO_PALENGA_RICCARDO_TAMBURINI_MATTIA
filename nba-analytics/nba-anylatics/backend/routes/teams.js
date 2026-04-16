const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT ID_squadra as id, Nome as name, Città as city, Conference as conference, 
             Vittorie as wins, Sconfitte as losses, Vittorie_pct as win_pct
      FROM squadra
      ORDER BY Vittorie_pct DESC
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT ID_squadra as id, Nome as name, Città as city, Conference as conference, Vittorie as wins, Sconfitte as losses, Vittorie_pct as win_pct FROM squadra WHERE ID_squadra = ?',
      [req.params.id]
    );
    if (rows.length === 0) return res.status(404).json({ error: 'Team non trovato' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
const express = require('express');
const router = express.Router();
const db = require('../db');

// GET /api/teams - tutti i team con win%
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT id, name, city, conference, wins, losses,
             ROUND(wins/(wins+losses)*100, 1) as win_pct
      FROM teams
      ORDER BY win_pct DESC
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/teams/:id
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT *, ROUND(wins/(wins+losses)*100,1) as win_pct FROM teams WHERE id = ?',
      [req.params.id]
    );
    if (rows.length === 0) return res.status(404).json({ error: 'Team non trovato' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
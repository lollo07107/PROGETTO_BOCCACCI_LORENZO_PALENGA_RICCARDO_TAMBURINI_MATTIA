const express = require('express');
const router = express.Router();
const db = require('../db');

// GET /api/players?search=name
router.get('/', async (req, res) => {
  const { search } = req.query;
  try {
    let query = `
      SELECT p.id, p.first_name, p.last_name, p.position,
             p.ppg, p.rpg, p.apg, p.fg_pct, t.name as team_name
      FROM players p
      LEFT JOIN teams t ON p.team_id = t.id
    `;
    const params = [];
    if (search) {
      query += ` WHERE CONCAT(p.first_name,' ',p.last_name) LIKE ?
                 OR t.name LIKE ?`;
      params.push(`%${search}%`, `%${search}%`);
    }
    query += ' ORDER BY p.ppg DESC';
    const [rows] = await db.query(query, params);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
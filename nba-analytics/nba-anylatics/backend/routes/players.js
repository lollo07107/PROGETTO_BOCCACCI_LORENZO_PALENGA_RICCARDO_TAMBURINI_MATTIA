const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/', async (req, res) => {
  const { search } = req.query;
  try {
    let query = `
      SELECT g.ID_giocatore as id, g.Nome as first_name, g.Cognome as last_name, 
             g.Posizione as position, g.Num_Maglia as jersey_number,
             s.ppg, s.rpg, s.apg, s.gf_pct as fg_pct,
             sq.Nome as team_name
      FROM giocatore g
      LEFT JOIN squadra sq ON g.FK_ID_squadra = sq.ID_squadra
      LEFT JOIN stagione_stat s ON g.ID_giocatore = s.FK_ID_giocatore
    `;
    const params = [];
    if (search) {
      query += ` WHERE CONCAT(g.Nome,' ',g.Cognome) LIKE ? OR sq.Nome LIKE ?`;
      params.push(`%${search}%`, `%${search}%`);
    }
    query += ' ORDER BY s.ppg DESC';
    const [rows] = await db.query(query, params);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
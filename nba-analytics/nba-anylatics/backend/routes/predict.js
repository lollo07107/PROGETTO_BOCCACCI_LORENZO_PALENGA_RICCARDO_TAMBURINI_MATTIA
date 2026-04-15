const express = require('express');
const router = express.Router();
const db = require('../db');

/**
 * ALGORITMO DI PREDIZIONE
 * Formula: P(vittoria A) = win_pct_A / (win_pct_A + win_pct_B) * 95%
 * Il 5% restante viene assegnato alla probabilità di pareggio.
 * 
 * POST /api/predict
 * Body: { homeTeamId, awayTeamId }
 */
router.post('/', async (req, res) => {
  const { homeTeamId, awayTeamId } = req.body;
  if (!homeTeamId || !awayTeamId)
    return res.status(400).json({ error: 'Seleziona entrambe le squadre' });
  if (homeTeamId === awayTeamId)
    return res.status(400).json({ error: 'Seleziona squadre diverse' });

  try {
    const [teams] = await db.query(
      'SELECT id, name, wins, losses FROM teams WHERE id IN (?, ?)',
      [homeTeamId, awayTeamId]
    );
    if (teams.length < 2)
      return res.status(404).json({ error: 'Squadre non trovate' });

    const home = teams.find(t => t.id == homeTeamId);
    const away = teams.find(t => t.id == awayTeamId);

    const homeWinPct = home.wins / (home.wins + home.losses);
    const awayWinPct = away.wins / (away.wins + away.losses);
    const total = homeWinPct + awayWinPct;

    const DRAW_PROB = 0.05;
    const homeProb = (homeWinPct / total) * (1 - DRAW_PROB);
    const awayProb = (awayWinPct / total) * (1 - DRAW_PROB);

    const winner = homeProb >= awayProb ? home.name : away.name;

    res.json({
      homeTeam: home.name,
      awayTeam: away.name,
      homeWinProb: (homeProb * 100).toFixed(1),
      awayWinProb: (awayProb * 100).toFixed(1),
      drawProb: (DRAW_PROB * 100).toFixed(1),
      predictedWinner: winner,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
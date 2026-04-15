const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const teamsRoutes = require('./routes/teams');
const playersRoutes = require('./routes/players');
const gamesRoutes = require('./routes/games');
const predictRoutes = require('./routes/predict');

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/teams', teamsRoutes);
app.use('/api/players', playersRoutes);
app.use('/api/games', gamesRoutes);
app.use('/api/predict', predictRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'NBA Analytics API running' });
});

// Dashboard summary endpoint
app.get('/api/dashboard', async (req, res) => {
  const db = require('./db');
  try {
    const [[{ totalTeams }]] = await db.query('SELECT COUNT(*) as totalTeams FROM teams');
    const [[{ totalPlayers }]] = await db.query('SELECT COUNT(*) as totalPlayers FROM players');
    const [[{ totalGames }]] = await db.query("SELECT COUNT(*) as totalGames FROM games WHERE status='final'");
    const [[{ avgPpg }]] = await db.query('SELECT ROUND(AVG(ppg),1) as avgPpg FROM players');

    const [recentGames] = await db.query(`
      SELECT g.id, g.game_date, g.home_score, g.away_score, g.status,
             t1.name as home_team, t2.name as away_team
      FROM games g
      JOIN teams t1 ON g.home_team_id = t1.id
      JOIN teams t2 ON g.away_team_id = t2.id
      WHERE g.status = 'final'
      ORDER BY g.game_date DESC LIMIT 3
    `);

    const [topTeams] = await db.query(`
      SELECT id, name, wins, losses,
             ROUND(wins/(wins+losses)*100,1) as win_pct
      FROM teams ORDER BY win_pct DESC LIMIT 5
    `);

    res.json({ totalTeams, totalPlayers, totalGames, avgPpg, recentGames, topTeams });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
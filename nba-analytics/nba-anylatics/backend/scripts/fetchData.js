const axios = require('axios');
const db = require('../db');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const BASE_URL = 'https://www.thesportsdb.com/api/v1/json/3';

// ---------- HELPERS ----------
function cleanString(str) {
  if (!str) return null;
  return String(str).trim().replace(/\s+/g, ' ');
}

// ---------- TEAMS ----------
async function fetchAndSaveTeams() {
  console.log('📥 Fetching NBA teams...');

  try {
    const res = await axios.get(
      `${BASE_URL}/search_all_teams.php?l=NBA`
    );

    const teams = res.data.teams;

    if (!teams) {
      console.log('⚠️ Nessun team trovato');
      return;
    }

    for (const team of teams) {
      const name = cleanString(team.strTeam);
      const city = cleanString(team.strStadiumLocation) || 'Unknown';

      await db.query(
        `INSERT INTO teams (name, city, conference)
         VALUES (?, ?, ?)
         ON DUPLICATE KEY UPDATE
         city = VALUES(city),
         conference = VALUES(conference)`,
        [name, city, 'NBA']
      );
    }

    console.log(`✅ Teams salvati: ${teams.length}`);
  } catch (err) {
    console.error('❌ Errore teams:', err.message);
  }
}

// ---------- PLAYERS ----------
async function fetchAndSavePlayers() {
  console.log('📥 Fetching players...');

  try {
    // 🔥 puoi cambiare squadra qui
    const teamName = 'Los Angeles Lakers';

    const res = await axios.get(
      `${BASE_URL}/searchplayers.php?t=${encodeURIComponent(teamName)}`
    );

    const players = res.data.player;

    if (!players) {
      console.log('⚠️ Nessun player trovato');
      return;
    }

    // trova team ID
    const [teamRows] = await db.query(
      'SELECT id FROM teams WHERE name = ? LIMIT 1',
      [teamName]
    );

    const teamId = teamRows.length ? teamRows[0].id : null;

    for (const p of players) {
      const fullName = cleanString(p.strPlayer);
      if (!fullName) continue;

      const parts = fullName.split(' ');
      const firstName = parts[0];
      const lastName = parts.slice(1).join(' ') || '';

      await db.query(
        `INSERT INTO players
        (first_name, last_name, position, team_id, ppg, rpg, apg, fg_pct)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          firstName,
          lastName,
          p.strPosition || 'G',
          teamId,
          0,
          0,
          0,
          0,
        ]
      );
    }

    console.log(`✅ Players salvati: ${players.length}`);
  } catch (err) {
    console.error('❌ Errore players:', err.message);
  }
}

// ---------- MAIN ----------
async function main() {
  console.log('🚀 Script NBA SportsDB avviato\n');

  await fetchAndSaveTeams();
  await fetchAndSavePlayers();

  console.log('\n✅ Fine script');
  process.exit(0);
}

main();
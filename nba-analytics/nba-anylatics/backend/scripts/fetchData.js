/**
 * DATA ENGINEERING SCRIPT
 * Raccoglie dati da balldontlie.io (API pubblica NBA)
 * Pulisce e inserisce nel database MySQL
 * 
 * Esegui con: node scripts/fetchData.js
 */

const axios = require('axios');
const db = require('../db');

const BASE_URL = 'https://api.balldontlie.io/v1';

// ------ DATA CLEANING HELPERS ------
function cleanString(str) {
  if (!str) return null;
  return str.trim().replace(/\s+/g, ' ');
}

function cleanNumber(val) {
  const n = parseFloat(val);
  return isNaN(n) ? 0 : n;
}

function mapConference(conf) {
  if (!conf) return 'East';
  return conf.toLowerCase().includes('west') ? 'West' : 'East';
}

// ------ FETCH TEAMS ------
async function fetchAndSaveTeams() {
  console.log('📥 Fetching teams...');
  try {
    const res = await axios.get(`${BASE_URL}/teams`);
    const teams = res.data.data;

    for (const team of teams) {
      const name = cleanString(team.full_name);
      const city = cleanString(team.city);
      const conference = mapConference(team.conference);

      // Upsert: se esiste aggiorna, altrimenti inserisce
      await db.query(
        `INSERT INTO teams (name, city, conference) VALUES (?, ?, ?)
         ON DUPLICATE KEY UPDATE city=VALUES(city), conference=VALUES(conference)`,
        [name, city, conference]
      );
    }
    console.log(`✅ Saved ${teams.length} teams`);
  } catch (err) {
    console.error('❌ Error fetching teams:', err.message);
  }
}

// ------ FETCH PLAYERS (season avg) ------
async function fetchAndSavePlayers() {
  console.log('📥 Fetching player stats...');
  try {
    const res = await axios.get(`${BASE_URL}/season_averages?season=2023`);
    const stats = res.data.data;

    for (const stat of stats) {
      const firstName = cleanString(stat.player?.first_name);
      const lastName = cleanString(stat.player?.last_name);
      if (!firstName || !lastName) continue;

      const ppg = cleanNumber(stat.pts);
      const rpg = cleanNumber(stat.reb);
      const apg = cleanNumber(stat.ast);
      const fgPct = cleanNumber(stat.fg_pct) * 100;

      // Trova il team corrispondente
      const [teamRows] = await db.query(
        'SELECT id FROM teams WHERE name LIKE ?',
        [`%${stat.team?.full_name || ''}%`]
      );
      const teamId = teamRows.length > 0 ? teamRows[0].id : null;

      await db.query(
        `INSERT INTO players (first_name, last_name, position, team_id, ppg, rpg, apg, fg_pct)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE ppg=VALUES(ppg), rpg=VALUES(rpg), apg=VALUES(apg), fg_pct=VALUES(fg_pct)`,
        [firstName, lastName, cleanString(stat.player?.position) || 'G', teamId, ppg, rpg, apg, fgPct]
      );
    }
    console.log(`✅ Saved ${stats.length} player stats`);
  } catch (err) {
    console.error('❌ Error fetching players:', err.message);
  }
}

// ------ MAIN ------
async function main() {
  console.log('🚀 NBA Data Engineering Script avviato\n');
  await fetchAndSaveTeams();
  await fetchAndSavePlayers();
  console.log('\n✅ Script completato');
  process.exit(0);
}

main();
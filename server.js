const express = require('express');
const Database = require('better-sqlite3');
const path = require('path');
const app = express();
const db = new Database('./data.db');

app.use(express.json());
app.use(express.static('public'));

// Init DB tables
db.exec(`
  CREATE TABLE IF NOT EXISTS entries (
    id TEXT PRIMARY KEY,
    person TEXT,
    date TEXT,
    stuck TEXT,
    stuckText TEXT,
    word TEXT,
    energy INTEGER,
    priorities TEXT,
    accomplished TEXT,
    commitTotal INTEGER,
    commitDone INTEGER,
    commitItems TEXT,
    coreValues TEXT,
    takeaways TEXT,
    kpiReview TEXT,
    monthWins TEXT,
    monthChallenges TEXT,
    monthGoals TEXT,
    timestamp TEXT
  );
  CREATE TABLE IF NOT EXISTS shoutouts (
    id TEXT PRIMARY KEY,
    fromPerson TEXT,
    honoree TEXT,
    value TEXT,
    date TEXT,
    timestamp TEXT
  );
  CREATE TABLE IF NOT EXISTS people (
    name TEXT PRIMARY KEY
  );
`);

// Seed default people if empty
const count = db.prepare('SELECT COUNT(*) as c FROM people').get();
if (count.c === 0) {
  const insert = db.prepare('INSERT OR IGNORE INTO people VALUES (?)');
  const defaults = ["Juliana NF","Andrés Velasco","Andrea","Luisa","Mónica","Silvana","Juliana S","David","Jesus","Nicolás F","Alejandra","Tatiana","Maria J","Olga","Juan Delgadillo","Juan Pablo","Camilo","Alejandro","Marco","Nicolás J","Laura"];
  defaults.forEach(name => insert.run(name));
}

// ENTRIES
app.get('/api/entries', (req, res) => {
  const rows = db.prepare('SELECT * FROM entries ORDER BY date DESC').all();
  res.json(rows.map(r => ({
    ...r,
    priorities: JSON.parse(r.priorities || '[]'),
    accomplished: JSON.parse(r.accomplished || '[]'),
    commitItems: JSON.parse(r.commitItems || '[]'),
  })));
});

app.post('/api/entries', (req, res) => {
  const e = req.body;
  db.prepare(`INSERT OR REPLACE INTO entries VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`).run(
    String(e.id), e.person, e.date, e.stuck||'', e.stuckText||'',
    e.word||'', e.energy||5,
    JSON.stringify(e.priorities||[]),
    JSON.stringify(e.accomplished||[]),
    e.commitTotal||0, e.commitDone||0,
    JSON.stringify(e.commitItems||[]),
    e.coreValues||'', e.takeaways||'',
    e.kpiReview||'', e.monthWins||'',
    e.monthChallenges||'', e.monthGoals||'',
    new Date().toISOString()
  );
  res.json({ success: true });
});

// SHOUTOUTS
app.get('/api/shoutouts', (req, res) => {
  res.json(db.prepare('SELECT * FROM shoutouts ORDER BY timestamp DESC').all());
});

app.post('/api/shoutouts', (req, res) => {
  const s = req.body;
  db.prepare('INSERT INTO shoutouts VALUES (?,?,?,?,?,?)').run(
    String(s.id), s.from, s.honoree, s.value, s.date, new Date().toISOString()
  );
  res.json({ success: true });
});

// PEOPLE
app.get('/api/people', (req, res) => {
  res.json(db.prepare('SELECT name FROM people ORDER BY name').all().map(r => r.name));
});

app.post('/api/people', (req, res) => {
  const { people } = req.body;
  db.prepare('DELETE FROM people').run();
  const insert = db.prepare('INSERT OR IGNORE INTO people VALUES (?)');
  people.forEach(name => insert.run(name));
  res.json({ success: true });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Tracker running on port ${PORT}`));

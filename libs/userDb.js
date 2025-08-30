const sqlite3 = require('sqlite3').verbose();

let db = new sqlite3.Database('./mydb.sqlite', (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Connected to mydb.sqlite');
});

function createTable() {
    return new Promise((resolve, reject) => {
        db.run(`CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY,
            username TEXT,
            telegram_id TEXT NOT NULL UNIQUE,
            progress INTEGER DEFAULT 0,
            current_stage INTEGER DEFAULT 1,
            available_water INTEGER DEFAULT 0
        )`, (err) => {
            if (err) return reject(err);
            console.log('Table "users" is ready');
            resolve();
        });
    });
}

function getUser(telegramId) {
    return new Promise((resolve, reject) => {
        db.get(`SELECT * FROM users WHERE telegram_id = ?`, [telegramId], (err, row) => {
            if (err) return reject(err);
            resolve(row);
        });
    });
}

function createOrUpdateUser(telegramId, data) {
    return new Promise((resolve, reject) => {
        const { progress, current_stage, available_water } = data;
        db.get(`SELECT * FROM users WHERE telegram_id = ?`, [telegramId], (err, row) => {
            if (err) return reject(err);

            if (row) {
                db.run(`UPDATE users SET progress = ?, current_stage = ?, available_water = ? WHERE telegram_id = ?`,
                    [progress, current_stage, available_water, telegramId],
                    function(updateErr) {
                        if (updateErr) return reject(updateErr);
                        resolve(this.changes);
                    });
            } else {
                db.run(`INSERT INTO users (telegram_id, progress, current_stage, available_water) VALUES (?, ?, ?, ?)`,
                    [telegramId, progress, current_stage, available_water],
                    function(insertErr) {
                        if (insertErr) return reject(insertErr);
                        resolve(this.lastID);
                    });
            }
        });
    });
}

module.exports = {
  createTable,
  getUser,
  createOrUpdateUser
};

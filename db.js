const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'eventdb',
    password: '1234',
    port: 5432
});

pool.connect()
  .then(() => console.log("DB CONNECTED TO CORRECT DATABASE"))
  .catch(err => console.error("DB ERROR:", err));

module.exports = pool;
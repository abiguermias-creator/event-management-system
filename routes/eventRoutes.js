const express = require('express');
const router = express.Router();
const pool = require('../db');

router.get('/', (req, res) => {
    res.redirect('/events');
});

// =====================
// SHOW ALL EVENTS
// =====================
router.get('/events', async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT * FROM events ORDER BY id DESC'
        );

        res.render('events', {
            events: result.rows,
            search: ''
        });

    } catch (err) {
        console.error(err);
        res.send("Database error");
    }
});

// =====================
// CREATE PAGE
// =====================
router.get('/events/new', (req, res) => {
    res.render('create');
});

// =====================
// ADD EVENT
// =====================
router.post('/events', async (req, res) => {
    try {
        console.log("BODY:", req.body);

        const { name, location, date } = req.body;

        const result = await pool.query(
            'INSERT INTO events(name, location, date, tickets) VALUES($1,$2,$3,50) RETURNING *',
            [name, location, date]
        );

        console.log("INSERT SUCCESS:", result.rows);

        res.redirect('/events');

    } catch (err) {
        console.error("CREATE ERROR:", err);
        res.send("CREATE FAILED - CHECK TERMINAL");
    }
});
// =====================
// EDIT PAGE
// =====================
router.get('/events/edit/:id', async (req, res) => {
    const result = await pool.query(
        'SELECT * FROM events WHERE id=$1',
        [req.params.id]
    );

    res.render('edit', { event: result.rows[0] });
});

// =====================
// UPDATE EVENT
// =====================
router.post('/events/edit/:id', async (req, res) => {
    const { name, location, date } = req.body;

    await pool.query(
        'UPDATE events SET name=$1, location=$2, date=$3 WHERE id=$4',
        [name, location, date, req.params.id]
    );

    res.redirect('/events');
});

// =====================
// DELETE EVENT
// =====================
router.post('/events/delete/:id', async (req, res) => {
    await pool.query(
        'DELETE FROM events WHERE id=$1',
        [req.params.id]
    );

    res.redirect('/events');
});

router.post('/events/book/:id', async (req, res) => {

    const result = await pool.query(
        'SELECT tickets FROM events WHERE id=$1',
        [req.params.id]
    );

    if (result.rows.length > 0 && result.rows[0].tickets > 0) {
        await pool.query(
            'UPDATE events SET tickets = tickets - 1 WHERE id=$1',
            [req.params.id]
        );
    }

    res.redirect('/events');
});

// =====================
// DETAILS PAGE
// =====================
router.get('/events/:id', async (req, res) => {
    const result = await pool.query(
        'SELECT * FROM events WHERE id=$1',
        [req.params.id]
    );

    res.render('eventDetails', { event: result.rows[0] });
});

router.get('/debug-db', async (req, res) => {
    const db = await pool.query('SELECT current_database()');
    const tables = await pool.query(
        "SELECT table_name FROM information_schema.tables WHERE table_schema='public'"
    );

    res.send({
        database: db.rows[0],
        tables: tables.rows
    });
});

module.exports = router;
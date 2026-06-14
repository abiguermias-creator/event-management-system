const express = require('express');
const path = require('path');
const pool = require('./db');

const app = express();

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


// ================= HOME =================
app.get('/', (req, res) => {
    res.redirect('/events');
});


// ================= EVENTS + SEARCH =================
app.get('/events', async (req, res) => {
    const search = req.query.search;

    let result;

    if (search) {
        result = await pool.query(
            'SELECT * FROM events WHERE name ILIKE $1 ORDER BY id DESC',
            [`%${search}%`]
        );
    } else {
        result = await pool.query(
            'SELECT * FROM events ORDER BY id DESC'
        );
    }

    res.render('events', {
        events: result.rows,
        search
    });
});


// ================= CREATE PAGE =================
app.get('/events/new', (req, res) => {
    res.render('create');
});


// ================= CREATE EVENT =================
app.post('/events', async (req, res) => {
    const { name, date, location } = req.body;

    await pool.query(
        'INSERT INTO events(name, date, location, tickets) VALUES($1,$2,$3,50)',
        [name, date, location]
    );

    res.redirect('/events');
});


// ================= EDIT PAGE =================
app.get('/events/edit/:id', async (req, res) => {
    const { id } = req.params;

    const result = await pool.query(
        'SELECT * FROM events WHERE id = $1',
        [id]
    );

    res.render('edit', { event: result.rows[0] });
});


// ================= UPDATE EVENT =================
app.post('/events/update/:id', async (req, res) => {
    const { id } = req.params;
    const { name, date, location } = req.body;

    await pool.query(
        'UPDATE events SET name=$1, date=$2, location=$3 WHERE id=$4',
        [name, date, location, id]
    );

    res.redirect('/events');
});


// ================= DELETE EVENT =================
app.post('/events/delete/:id', async (req, res) => {
    const { id } = req.params;

    await pool.query(
        'DELETE FROM events WHERE id=$1',
        [id]
    );

    res.redirect('/events');
});


// ================= BOOK TICKET =================
app.post('/events/book/:id', async (req, res) => {
    const { id } = req.params;

    const result = await pool.query(
        'SELECT tickets FROM events WHERE id = $1',
        [id]
    );

    if (result.rows[0].tickets > 0) {
        await pool.query(
            'UPDATE events SET tickets = tickets - 1 WHERE id = $1',
            [id]
        );
    }

    res.redirect('/events');
});


// ================= EVENT DETAILS =================
app.get('/events/:id', async (req, res) => {
    const { id } = req.params;

    const result = await pool.query(
        'SELECT * FROM events WHERE id = $1',
        [id]
    );

    res.render('eventDetails', { event: result.rows[0] });
});


// ================= SERVER =================
app.listen(3000, () => {
    console.log('SERVER RUNNING ON http://localhost:3000');
});
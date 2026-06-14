const express = require('express');
const router = express.Router();

// =====================
// Dummy data (replace later with DB)
// =====================
let events = [
    { id: 1, name: "Birthday Party", location: "A.A", date: "2026-06-16" }
];

// =====================
// Show all events
// =====================
router.get('/events', (req, res) => {
    res.render('events', { events });
});

// =====================
// Create page
// =====================
router.get('/events/create', (req, res) => {
    res.render('create');
});

// =====================
// Add event
// =====================
router.post('/events/create', (req, res) => {
    const { name, location, date } = req.body;

    const newEvent = {
        id: events.length + 1,
        name,
        location,
        date
    };

    events.push(newEvent);
    res.redirect('/events');
});

// =====================
// Edit page
// =====================
router.get('/events/edit/:id', (req, res) => {
    const event = events.find(e => e.id == req.params.id);
    res.render('edit', { event });
});

// =====================
// Update event
// =====================
router.post('/events/edit/:id', (req, res) => {
    const { name, location, date } = req.body;

    let event = events.find(e => e.id == req.params.id);

    if (event) {
        event.name = name;
        event.location = location;
        event.date = date;
    }

    res.redirect('/events');
});

// =====================
// Delete event
// =====================
router.get('/events/delete/:id', (req, res) => {
    events = events.filter(e => e.id != req.params.id);
    res.redirect('/events');
});

// =====================
// Event details
// =====================
router.get('/events/:id', (req, res) => {
    const event = events.find(e => e.id == req.params.id);
    res.render('eventDetails', { event });
});

module.exports = router;
const express = require('express');
const path = require('path');

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// ROUTES
const eventRoutes = require('./routes/eventRoutes');
app.use('/', eventRoutes);

module.exports = app;
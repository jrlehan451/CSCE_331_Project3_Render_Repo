const express = require('express');
const { Pool } = require('pg');
const dotenv = require('dotenv').config();

// Create express app
const app = express();
const port = 3000;

app.use('/css', express.static('css'));
app.use('/js', express.static('functions'));

app.locals.capitalizeName = function(name, delimiter) {
    const words = name.split(delimiter);

    for (let i = 0; i < words.length; i++) {
        words[i] = words[i][0].toUpperCase() + words[i].substr(1);
    }

    return words.join(' ');
}

// Create pool
const pool = new Pool({
    user: process.env.PSQL_USER,
    host: process.env.PSQL_HOST,
    database: process.env.PSQL_DATABASE,
    password: process.env.PSQL_PASSWORD,
    port: process.env.PSQL_PORT,
    ssl: {rejectUnauthorized: false}
});

// Add process hook to shutdown pool
process.on('SIGINT', function() {
    pool.end();
    console.log('Application successfully shutdown');
    process.exit(0);
});

app.set("view engine", "ejs");

app.get('/', (req, res) => {
    const data = {name: 'Mario'};
    res.render('index', data);
});

app.get('/user', (req, res) => {
    teammembers = []
    pool
        .query('SELECT * FROM teammembers;')
        .then(query_res => {
            for (let i = 0; i < query_res.rowCount; i++){
                teammembers.push(query_res.rows[i]);
            }
            const data = {teammembers: teammembers};
            console.log(teammembers);
            res.render('user', data);        
        });
});

app.get('/drink_options', (req, res) => {
    drink_categories = []
    pool
        .query('SELECT DISTINCT category FROM drinks;')
        .then(query_res => {
            for (let i = 0; i < query_res.rowCount; i++){
                drink_categories.push(query_res.rows[i]);
            }
            const data = {drink_categories: drink_categories};
            console.log(drink_categories);
            res.render('drink_options', data);        
        }); 
});

app.get('/add_drink', (req, res) => {
    drinks = []
    category = req.query.category;
    const query = {
        text: 'SELECT * FROM drinks WHERE category = $1',
        values: [category],
    }
    pool
        .query(query)
        .then(query_res => {
            for (let i = 0; i < query_res.rowCount; i++){
                drinks.push(query_res.rows[i]);
            }                
            const data = {drinks: drinks};
            console.log(drinks);
            res.render('add_drink', data);        
        });
});

app.get('/add_on', (req, res) => {
    add_ons = []
    pool
        .query('SELECT * FROM ingredients WHERE cost > 0;')
        .then(query_res => {
            for (let i = 0; i < query_res.rowCount; i++){
                add_ons.push(query_res.rows[i]);
            }
            const data = {add_ons: add_ons};
            console.log(add_ons);
            res.render('add_on', data);        
        }); 
});


app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
const express = require('express');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config({path: './.env'});

const app = express();

const publicDirectory = path.join(__dirname, './public');
app.use(express.static(publicDirectory));

app.use(express.urlencoded({ extended: false }));

app.use(express.json());

app.set('view engine', 'hbs');



app.use('/', require('./routes/pages'));
app.use('/products', require('./routes/products'));
app.use('/checkout', require('./routes/checkout'));

app.listen(5000, () => {
    console.log("Server is running on port 5000");
})
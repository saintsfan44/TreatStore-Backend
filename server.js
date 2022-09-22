const express = require('express');
const path = require('path');

const app = express();

const publicDirectory = path.join(__dirname, './public');
app.use(express.static(publicDirectory));

app.set('view engine', 'hbs');



app.use('/', require('./routes/pages'));
app.use('/products', require('./routes/products'));

app.listen(5000, () => {
    console.log("Server is running on port 5000");
})
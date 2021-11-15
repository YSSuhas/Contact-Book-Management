const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');

const connectdb = require('./database/connectdb');

const contactRoute = require('./routes/contactroute');

dotenv.config();

connectdb();

const app = express();

app.use(express.json());
app.use(morgan('dev'));

app.get('/', (req,res) => {
    res.send("API is running...");
})

app.use('/api/contacts', contactRoute);

const port = process.env.PORT || 9000;
const host = process.env.HOST;

app.listen(port , console.log(`Server running in ${host} on port ${port}`));
const express = require('express');
const mongoose = require('mongoose');
const routes = require('./src/routes/route')
const dotenv = require ('dotenv')

dotenv.config()

const app = express();
const PORT = 3030


app.use(express.json());

mongoose.connect(process.env.DB_URL, {
    // useNewUrlParse: true,
    useUnifiedTopology: true
})
    .then(() =>
    {
        console.log('Successfully connected to db')
    })
    .catch((error) =>
    {
        console.log('Error connecting to db', error)
    });

app.use('/', routes)


app.listen(PORT, () =>
{
    console.log(`Server running on port ${PORT}`)
})
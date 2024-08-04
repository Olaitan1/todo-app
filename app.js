const express = require('express');
const mongoose = require('mongoose');
const routes = require('./src/routes/route')
const userRoutes = require('./src/routes/user-route')
const dotenv = require ('dotenv')

dotenv.config()

const app = express();
const PORT = 3010


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
app.use("/users", userRoutes);

app.get("/", (req, res) =>
{
    res.send('Welcome to my Todo')
});

app.listen(PORT, () =>
{
    console.log(`Server running on port ${PORT}`)
})
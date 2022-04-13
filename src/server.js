const express = require('express');

const app = express();

const userRoutes = require("./routes/user.routes");

app.use(express.json());

app.use(userRoutes)


app.get('/', (req, res) => {
    return res.json({ message: 'Hello World' });
})

module.exports = app;
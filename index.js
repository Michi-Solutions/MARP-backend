const express = require('express');

const app = express();

const userRoutes = require("./src/routes/user.routes");

app.use(express.json());

app.use(userRoutes)


app.get('/', (req, res) => {
    return res.json({ message: 'Hello World' });
})

app.listen(3000)
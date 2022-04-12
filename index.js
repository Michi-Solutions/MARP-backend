const express = require('express');

const app = express();

app.use(express.urlencoded({ extended: false }));

app.get('/', (req, res) => {
    return res.json({ message: 'Hello World' });
})

app.listen(3000)
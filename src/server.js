const express = require('express');
const app = express();
const userRoutes = require("./routes/user.routes");
const cors = require('cors');

app.use(cors());
app.use(express.json());
app.use(userRoutes)


app.get('/', (req, res) => {
    return res.json({ message: 'Hello World' });
})
app.listen(8080, () => console.log("API is running on port 8080"));

module.exports = app;
const express = require('express');
const app = express();
const formData = require('express-form-data');

const userRoutes = require("./routes/user.routes");
const areaConhecimentoRoutes = require("./routes/areaConhecimento.routes");
const conteudoRoutes = require("./routes/conteudo.routes");
const quizRoutes = require("./routes/quiz.routes");

const cors = require('cors');

app.use(cors());
app.use(express.json());
app.use(formData.parse());
app.use(userRoutes, areaConhecimentoRoutes, conteudoRoutes, quizRoutes);


app.get('/', (req, res) => {
    return res.json({ message: 'Hello World' });
})

module.exports = app;
const cors = require('cors');
const app = require('./src/server');

app.use(cors({
    origin: '*'
}));


app.listen(3000)
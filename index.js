var express      = require('express');
var spotify      = require('spotify-web-api-node');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send("Welcome to the backend");
});

app.listen(process.env.PORT || 3000, () => {
    console.log("Server up!");
});
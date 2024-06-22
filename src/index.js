const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const app = express();
const user_routes = require('./routes/user_routes');
const dotenv = require('dotenv');
dotenv.config()


app.use(cors({optionsSuccessStatus: 200})); 
app.use(express.json());
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.get("/", function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});

connectDB();

app.use('/api',user_routes);

const listener = app.listen(process.env.PORT || 3000, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});

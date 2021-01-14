require('dotenv').config();
const express = require('express');
const session = require('express-session');
const massive = require('massive');
const authCtrl = require('./controllers/authController')
const treasureCtrl = require('./controllers/treasureController');
const auth = require('./middleware/middleware');
const PORT = 4000;

const {SESSION_SECRET, CONNECTION_STRING} = process.env;

const app = express();

app.use(express.json());

massive({
  connectionString: CONNECTION_STRING,
  ssl: {rejectUnauthorized: false}
}).then(db => {
  app.set('db', db);
  console.log('db connected');
});

app.use(
  session({
    resave: true,
    saveUninitialized: false,
    secret: SESSION_SECRET,
  })
);
app.post('/api/register', authCtrl.register);
app.post('/api/login', authCtrl.login);
app.get('/api/logout', authCtrl.logout)

app.get('/api/treasure/dragon', treasureCtrl.dragonTreasure)
app.get('/api/treasure/user', auth.usersOnly, treasureCtrl.getUserTreasure)
app.get('/api/treasure/all', auth.usersOnly, treasureCtrl.getAllTreasure)
app.get('/api/treasure/all', auth.adminsOnly, treasureCtrl. getAllTreasure)
app.post('/api/treasure/user', auth.usersOnly, treasureCtrl.addUserTreasure)

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
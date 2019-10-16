require('dotenv').config();
const express = require('express');
const session = require('express-session');
const massive = require('massive');
const authCtrl = require('../controllers/authController');
const treasureCtrl = require('../controllers/treasureController');
const auth = require('../server/middleware/authMiddleware');
const {CONNECTION_STRING, SESSION_SECRET} = process.env;

const PORT = 4000;
const app = express();

app.use(express.json());

massive(CONNECTION_STRING).then(db => {
    app.set('db', db);
    console.log('database is connected')
})

app.use(session({
    resave: true,
    saveUninitialized: false,
    secret: SESSION_SECRET
}))

//endpoints for user
app.post('/auth/register', authCtrl.register);
app.post('/auth/login', authCtrl.login);
app.get('/auth/logout', authCtrl.logout);

//endpoints for treasure
app.get('/api/treasure/dragon', treasureCtrl.dragonTreasure);
app.get('/api/treasure/user', auth.usersOnly, treasureCtrl.getUserTreasure);
app.post('/api/treasure/user', auth.usersOnly, treasureCtrl.addUserTreasure);
app.get('/api/treasure/all', auth.usersOnly, auth.adminsOnly, treasureCtrl.getAllTreasure);

app.listen(PORT, () => console.log(`Server listening on ${PORT}`));
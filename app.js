const express = require('express');
const path = require('path');
const exphbs  = require('express-handlebars');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const session = require('express-session');
const bodyParser = require('body-parser');
const passport = require('passport');
const mongoose = require('mongoose');

const app = express();

// Load Routes
const members = require('./routes/members');
const users = require('./routes/users');

// Passport config
require('./config/passport')(passport);

//DB CONFIG
const db = require('./config/database');

// Connect to Mongoose
mongoose.connect(db.mongoURI)
    .then(() => {console.log('MongoDB Connected')})
    .catch(err => console.log(err));

// Handlebars Middleware
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

// Body Parser Middleware
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

//Method Override Middleware
app.use(methodOverride('_method'))

// Express Session Middleware
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
  }))

// Passport Session Middleware
app.use(passport.initialize());
app.use(passport.session());

// Flash Middleware
app.use(flash());

//Global Variables
app.use(function(req, res, next){
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null;
    next();
});

// Public Static Folder
app.use(express.static(path.join(__dirname, 'public')));

//Use Routes
app.use('/members', members);
app.use('/users', users);

app.get('/', (req, res) => {
    res.render('index');
});

const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log(`Server Started on port ${port}`);
});
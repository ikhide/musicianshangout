const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const expressValidator = require('express-validator');
const mongoose = require('mongoose');
const passport = require('passport');

//Mongoose connect
mongoose.connect('mongodb://musiccianshangout:Flstudio123#@ds131942.mlab.com:31942/musicianshangout', { useNewUrlParser: true});//
const db = mongoose.connection;

// init app
const app = express();

//moment time formatter
app.locals.moment = require('moment')

// Routes variables
const index = require('./routes/index');
const articles = require('./routes/articles');
const instruments = require('./routes/instruments');
const manage = require('./routes/manage');

// View Setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// Body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

// Express Session
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true
}));

//Init passport
app.use(passport.initialize());
app.use(passport.session());

// Express messages
app.use(require('connect-flash')());
app.use((req, res, next) => {
  res.locals.messages = require('express-messages')(req, res);
  res.locals.user = req.user || null;
  next();
});

// Express validator
app.use(expressValidator({
  errorFormatter: (param, msg, value) => {
      const namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));

app.use('/', index);
app.use('/articles', articles);
app.use('/instruments', instruments);
app.use('/manage', manage);

// Port
const port = process.env.PORT;
app.listen(port, () => {
  console.log('Server started on port '+port);
});

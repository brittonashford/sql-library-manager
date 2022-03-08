const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const pug = require('pug');
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const Sequelize = require('sequelize');
const models = require('./models');

const app = express();

//route to serve static files
app.use('/static', express.static('public'));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: 'library.db'
});

//check DB connection and sync
//IIFE because await must occur in a function
(async () => {
  try{
    await sequelize.authenticate();
    console.log('Connection was sucessful.');
  } catch (error) {
    console.error('Unable to connect to the database: ', error);
  }

  await sequelize.sync({ force: true });
  console.log('Model has been synced with the database.');
})();
 
//404 error handler
app.use((req, res) => {
  console.log('404 error handler hit');
  const error = new Error('Page not found.');
  error.status = 404;
  res.status(404).render('page-not-found', {error}); 
});

//global error handler
app.use((err, req, res, next) => {
  if (err.status === 404) {  
    res.status(404).render('page-not-found', {err});
  } else {
    console.log('Global error handler hit');
    err.message = err.message || 'A server error occured while processing your request';
    res.locals.error = err;
    res.status(err.status || 500).render('error', {err});
  }
});

module.exports = app;
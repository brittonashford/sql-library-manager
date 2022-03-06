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
app.use((req, res, next) => {
  const error = new Error();
  error.status = 404;
  error.message = 'Page not found.';
  console.log('404 error handler hit');
  // res.render('page-not-found', {error}); 
  next(error);
});

//global error handler
app.use((err, req, res, next) => {
if (err) {
  console.log('Global error handler hit', {err});
}
if (err.status === 404) {  
  res.status(404).render('page-not-found', {err});
} else {
  err.status = err.status || 500;
  err.message = err.message || 'An error occured processing your request';
  render('error', {err});
}
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  //render the error page
  res.status(err.status || 500);
  res.render('error', {err});
});

module.exports = app;

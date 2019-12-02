require('dotenv').config();

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var index = require('./routes/index');
var users = require('./routes/users');
const axios = require('axios');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'dist')));

app.use('/', index);
app.use('/users', users);


/**
 *
 * Podcast API: Typeahead 
 *
 */
app.get('/api/typeahead/', function (req, res, next) {
  const getKey = process.env.API_LISTEN_TOKEN;
  const buildParams = {
    q: req.query.q,
    show_podcasts: req.query.show_podcasts || '0',
    show_genres: req.query.show_genres || '0',
    safe_mode: req.query.safe_mode || '0'
  }
  axios
    .get('https://listen-api.listennotes.com/api/v2/typeahead', {
      headers: {
        'X-ListenAPI-Key': getKey
      },
      responseType: 'json',
      params: buildParams,
      timeout: 5000
    })
    .then(function (response) {
      res.status(200);
      res.json({
        apiResponse: response.data,
        apiStatus: response.status
      });
    })
    .catch(function (err) {
      res.json({
        apiError: err.response.status
      });
    });
});
/* /end Podcast API: Typeahead */

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
/**
 * Load .env file: *
 * exposes data as process.env props;
 * !NOTE: this should be placed at top of fle
 */
require('dotenv').config();
const express = require('express');
const compression = require('compression');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
// Axios: for requests
const axios = require('axios');
/**
 * Routes:
 * routing setup
 */
const appRoutes = {
  index: require('./routes/index'),
  search: require('./routes/search'),
  api: require('./routes/api')
};

// set app
const app = express();
// set global app.locals namespace
app.locals.pod = {};

/**
 * Favicon:
 *
 */
// TODO: uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

/**
 * Redis:
 */
// TODO: need to decide whether redis will be used; if not, remove
// const Redis = require("ioredis");
// const redis = new Redis(process.env.REDIS_URL || 6379);
// app.locals.pod.redis = {
//   client: redis,
//   expirationTime: 21600
// };

/**
 * View engine:
 * set vew engine
 */
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

/**
 * Middleware:
 * setup middleware
 */
// compression: allows for gzip
app.use(compression());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: false
  })
);
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'dist')));

app.use(function(req, res, next) {
  // res.locals.user = req.user;
  // res.locals.authenticated = !req.user.anonymous;
  next();
});

/**
 * Routing:
 * handle routing here
 */
app.use('/', appRoutes.index);
app.use('/podcast/*/*', appRoutes.index);
app.all('/api/*', appRoutes.api);
app.use('/search', appRoutes.search);

/**
 * error handlers
 */
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});
/** /end error handlers */

module.exports = app;

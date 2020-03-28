const Express = require('express');
const Router = Express.Router();

const DEFAULT_TITLE = 'PodNexus: Podcast Web Player Demo';

/**
 * home
 */
Router.get('/', function(req, res, next) {
  res.render('index', {
    title: DEFAULT_TITLE
  });
});

/**
 * podcast detail page
 */
Router.get('/podcast/:routePodTitle/:routePodID', function(req, res, next) {
  res.render('index', {
    title: DEFAULT_TITLE
  });
});

/**
 * search page
 */
Router.get('/search/:routeSearch', function(req, res, next) {
  res.render('index', {
    title: DEFAULT_TITLE
  });
});

Router.get('*', function(req, res, next) {
  res.status(404);
  res.render('index', {
    title: '404. You done did it.'
  });
});

module.exports = Router;

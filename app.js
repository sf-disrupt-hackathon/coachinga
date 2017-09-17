'use strict';

/**
 * Module dependencies
 */
var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var fs = require('fs');
var http = require('http');

var app = express();

app.use('/', express.static('public/'));

/**
 * Create HTTP server.
 */

app.listen(8080, function () {
  console.log('Express server listening on port 8080');
});

var cfenv = require('cfenv'),
  watson = require('watson-developer-cloud');

// Set up environment variables
// cfenv provides access to your Cloud Foundry environment
var vcapLocal = null;
try {
  vcapLocal = require("./vcap-local.json");
} catch (e) {}

var appEnvOpts = vcapLocal ? {
  vcap: vcapLocal
} : {};
var appEnv = cfenv.getAppEnv(appEnvOpts);

// Configure Express
// serve the files out of ./public as our main files
app.enable('trust proxy');

app.use(bodyParser.urlencoded({
  extended: true,
  limit: '1mb'
}));
app.use(bodyParser.json({
  limit: '1mb'
}));
app.use(express.static(__dirname + '/public'));

// Deployment tracker code snippet
require("cf-deployment-tracker-client").track();

// // Start listening for connections
// app.listen(appEnv.port, function () {
//   console.log("server started at", appEnv.url);
// });

// Configure Watson Speech to Text service
// var speechCreds = getServiceCreds(appEnv, 'rtt-speech-to-text');
// speechCreds.version = 'v1';
// var authService = watson.authorization(speechCreds);

// Configure Watson Speech to Text service
var toneCreds = getServiceCreds(appEnv, 'rtt-tone-analyzer');
toneCreds.version = 'v3';
toneCreds.version_date = '2016-05-19';
var toneAnalyzer = watson.tone_analyzer(toneCreds);

// Root page handler
// app.get('/', function (req, res) {
//   res.render('index', {
//     ct: req._csrfToken
//   });
// });

// Get token using your credentials
// app.post('/api/token', function (req, res, next) {
//   authService.getToken({
//     url: speechCreds.url
//   }, function (err, token) {
//     if (err)
//       next(err);
//     else
//       res.send(token);
//   });
// });

// Request handler for tone analysis
app.post('/api/tone', function (req, res, next) {
  toneAnalyzer.tone(req.body, function (err, data) {
    if (err)
      return next(err);
    else
      return res.json(data);
  });
});

// error-handler settings
// require('./config/error-handler')(app);

// Retrieves service credentials for the input service
function getServiceCreds(appEnv, serviceName) {
  var serviceCreds = appEnv.getServiceCreds(serviceName);
  if (!serviceCreds) {
    console.log("service " + serviceName + " not bound to this application");
    return null;
  }
  return serviceCreds;
}
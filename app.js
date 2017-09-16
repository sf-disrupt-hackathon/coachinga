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

app.use('/', express.static('/'));

/**
 * Create HTTP server.
 */

app.listen(8080, function () {
  console.log('Express server listening on port 8080');
});
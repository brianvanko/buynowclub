var gulp = require('gulp');
var csso = require('gulp-csso');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var recess = require('gulp-recess');
var header = require('gulp-header');
var gulpFilter = require('gulp-filter');
var complexity = require('gulp-complexity');
var ngAnnotate = require('gulp-ng-annotate');
var templateCache = require('gulp-angular-templatecache');

var banner = ['/**',
  ' * BuyNow.Club',
  ' * (c) 2015 Brian Vanko',
  ' * License: MIT',
  ' * Last Updated: <%= new Date().toUTCString() %>',
  ' */',
  ''].join('\n');


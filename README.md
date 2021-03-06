gulp-fncallback
=============

[![npm version](https://badge.fury.io/js/%40gerhobbelt%2Fgulp-fncallback.svg)](https://www.npmjs.com/package/@gerhobbelt/gulp-fncallback)
[![Build Status](https://travis-ci.org/GerHobbelt/gulp-fncallback.svg?branch=master)](https://travis-ci.org/GerHobbelt/gulp-fncallback)

Add own callback to streaming

## Install

```
npm install --dev @gerhobbelt/gulp-fncallback
```

## Usage transformFunction
```javascript
var less = require('gulp-less');
var callback = require('@gerhobbelt/gulp-fncallback');

gulp.task('less', function () {
  gulp.src('./less/**/*.less')
    .pipe(less({
      paths: [ path.join(__dirname, 'less', 'includes') ]
    }))
    .pipe(callback(function (file, enc, cb) {
      console.log(file);
      cb();
    }))
    .pipe(gulp.dest('./public/css'));
});
```

## Usage transformFunction and flushFunction
```javascript
var less = require('gulp-less');
var callback = require('@gerhobbelt/gulp-fncallback');

gulp.task('less', function () {
  gulp.src('./less/**/*.less')
    .pipe(less({
      paths: [ path.join(__dirname, 'less', 'includes') ]
    }))
    .pipe(callback(function (file, enc, cb) {
      console.log(file);
      cb();
    }, function (callback) {
      callback();
    }))
    .pipe(gulp.dest('./public/css'));
});
```

## Usage transformFunction with error
```javascript
var less = require('gulp-less');
var callback = require('@gerhobbelt/gulp-fncallback');

gulp.task('less', function () {
  gulp.src('./less/**/*.less')
    .pipe(less({
      paths: [ path.join(__dirname, 'less', 'includes') ]
    }))
    .pipe(callback(function (file, enc, cb) {
      console.log(file);
      cb('error');
    }))
    .pipe(gulp.dest('./public/css'));
});
```

## Usage transformFunction with new file
```javascript
var less = require('gulp-less');
var callback = require('@gerhobbelt/gulp-fncallback');

gulp.task('less', function () {
  gulp.src('./less/**/*.less')
    .pipe(less({
      paths: [ path.join(__dirname, 'less', 'includes') ]
    }))
    .pipe(callback(function (file, enc, cb) {
      var newFile = ...
      cb(null, newFile);
    }))
    .pipe(gulp.dest('./public/css'));
});
```

## Usage transformFunction with new file and append old file
```javascript
var less = require('gulp-less');
var callback = require('@gerhobbelt/gulp-fncallback');

gulp.task('less', function () {
  gulp.src('./less/**/*.less')
    .pipe(less({
      paths: [ path.join(__dirname, 'less', 'includes') ]
    }))
    .pipe(callback(function (file, enc, cb) {
      var newFile = ...
      cb(null, newFile, true);
    }))
    .pipe(gulp.dest('./public/css'));
});
```

## Options

once - Run callback once
```javascript
var less = require('gulp-less');
var callback = require('@gerhobbelt/gulp-fncallback');

gulp.task('less', function () {
  gulp.src('./less/**/*.less')
    .pipe(less({
      paths: [ path.join(__dirname, 'less', 'includes') ]
    }))
    .pipe(callback(function (file, enc, cb) {
      console.log(file);
      cb();
    }, {
      once: true
    }))
    .pipe(gulp.dest('./public/css'));
});
```


# gulp-csvtojson [![Build Status](https://travis-ci.org/wizicer/gulp-csvtojson.svg?branch=master)](https://travis-ci.org/wizicer/gulp-csvtojson)

> gulp plugin to wrap [csvtojson] 


## Install

```
$ npm install --save-dev gulp-csvtojson
```


## Usage

Here is the code snippet for general usage which generate json for you.

```js
var gulp = require('gulp');
var csvtojson = require('gulp-csvtojson');

gulp.task('default', function () {
    return gulp.src('src/file.csv')
        .pipe(csvtojson())
        .pipe(gulp.dest('dist'));
});
```

Here is the code snippet for generating js file.

```js
var gulp = require('gulp');
var csvtojson = require('gulp-csvtojson');
var insert = require('gulp-insert');
var ext_replace = require('gulp-ext-replace');

gulp.task('default', function () {
    return gulp.src('src/file.csv')
        .pipe(csvtojson())
        .pipe(insert.prepend('var anyVariable = '))
        .pipe(insert.append(';'))
        .pipe(ext_replace('.js'))
        .pipe(gulp.dest('dist'));
});
```

## API

Since v0.2.0, API no longer supported, to achieve the same result, please adapt your code according
to the second code snippet.

## License

MIT © [Icer](http://icerdesign.com)

[csvtojson]: https://github.com/Keyang/node-csvtojson

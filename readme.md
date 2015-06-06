# gulp-csvtojson [![Build Status](https://travis-ci.org/wizicer/gulp-csvtojson.svg?branch=master)](https://travis-ci.org/wizicer/gulp-csvtojson)

> gulp plugin to wrap [csvtojson] 


## Install

```
$ npm install --save-dev gulp-csvtojson
```


## Usage

```js
var gulp = require('gulp');
var csvtojson = require('gulp-csvtojson');

gulp.task('default', function () {
    return gulp.src('src/file.csv')
        .pipe(csvtojson({genjs: true}))
        .pipe(gulp.dest('dist'));
});
```


## API

### csvtojson(options)

#### options

##### genjs

Type: `bool`  
Default: `false`

When set true, output `.js` file with global variable assignment.

##### globalvariable

Type: `string`  
Default: `null`

The name which global variable will be assigned the json object.  
Only available when `genjs` is set to `true`.

## License

MIT © [Icer](http://icerdesign.com)

[csvtojson]: https://github.com/Keyang/node-csvtojson

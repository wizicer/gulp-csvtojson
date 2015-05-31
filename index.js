'use strict';
var gutil = require('gulp-util');
var through = require('through2');
var Converter=require("csvtojson").core.Converter;


module.exports = function (options) {
    if (typeof(options) === "undefined") {
        options = {};
    }
    // if (!options.foo) {
    //     throw new gutil.PluginError('gulp-csvtojson', '`foo` required');
    // }

    return through.obj(function (file, enc, cb) {
        if (file.isNull()) {
            cb(null, file);
            return;
        }

        if (file.isStream()) {
            cb(new gutil.PluginError('gulp-csvtojson', 'Streaming not supported'));
            return;
        }

        try {

            var csvConverter = new Converter(options);
            var gulpobj = this;
            
            csvConverter.fromString(file.contents.toString(), function(err, jsonObj) {
                var output = JSON.stringify(jsonObj);
                file.path = file.path.slice(0, file.path.indexOf('.')) + ".json"
                if (typeof(options.globalvariable) !== "undefined") {
                    file.path = file.path.slice(0, file.path.indexOf('.')) + ".js"
                    output = options.globalvariable + "=" + output + ";";
                }
                file.contents = new Buffer(output);
                gulpobj.push(file);
                cb();
            });

        } catch (err) {
            this.emit('error', new gutil.PluginError('gulp-csvtojson', err));
            cb(new gutil.PluginError('gulp-csvtojson', err));
        }

    });
};

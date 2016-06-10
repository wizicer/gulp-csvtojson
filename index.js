'use strict';
var path = require('path');
var gutil = require('gulp-util');
var through = require('through2');
var Converter = require("csvtojson").Converter;

var processStream = function(file,options,cb){
    var csvConverter = new Converter(options);

    file.contents = file.contents.pipe(csvConverter);
    cb();
};

var processBuffer = function(file,options,cb){
    var csvConverter = new Converter(options);
                
    csvConverter.fromString(file.contents.toString(), function(err, jsonObj) {
        if(err){
            return cb(err);
        }

        var output = JSON.stringify(jsonObj);
        file.contents = new Buffer(output);
        cb();
    });
};

module.exports = function (options) {
    if (typeof(options) === "undefined") {
        options = { };
    }

    return through.obj(function (file, enc, cb) {
        var self = this;

        if (file.isNull()) {
            return cb(null, file);
        }
        
        try {
            var done = function(err){
                if(err){ throw err; }
                file.path = gutil.replaceExtension(file.path,'.json');
                self.push(file);
                return cb();
            };

            if (file.isStream()) {
                return processStream(file,options,done);
            }

            if(file.isBuffer()){
                return processBuffer(file,options,done);
            }

        } catch (err) {
            this.emit('error', new gutil.PluginError('gulp-csvtojson', err));
            cb(new gutil.PluginError('gulp-csvtojson', err));
        }
    });
};

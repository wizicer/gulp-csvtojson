'use strict';
var path = require('path');
var gutil = require('gulp-util');
var through = require('through2');
var Converter=require("csvtojson").Converter;

var getVariableName = function(file,options){
    if (typeof(options.globalvariable) !== "undefined" && options.globalvariable !== null)
        return options.globalvariable;

    return path.basename(file.path, path.extname(file.path))
};

var onComplete = function(stream,file,options,done){
    if (options.genjs){
        file.path = gutil.replaceExtension(file.path,'.js');
    }
    else
        file.path = gutil.replaceExtension(file.path,'.json');

    stream.push(file);
    return done();
};

var generateJsStream = function(variablename){
    var firstLine = true;
    return through(function(chunk,enc,cb){
        if(firstLine){
            this.push("var "+variablename+" = ");
            firstLine=false;
        }

        this.push(chunk);
        cb();
    },function (cb) {
        this.push(';');
        cb();
    });
};

module.exports = function (options) {
    if (typeof(options) === "undefined") {
        options = { genjs: false };
    }

    return through.obj(function (file, enc, cb) {
        var self = this;

        if (file.isNull()) {
            cb(null, file);
            return;
        }
        
        try {
            if (file.isStream()) {
                options.constructResult=false;
                options.toArrayString=true;
                var csvConverter = new Converter(options);

                file.contents = file.contents.pipe(csvConverter);
                if (options.genjs) {
                    var variablename = getVariableName(file,options)
                    file.contents = file.contents.pipe(generateJsStream(variablename));
                }
                return onComplete(self,file,options,cb);
            }

            if(file.isBuffer()){
                var csvConverter = new Converter(options);
                            
                csvConverter.fromString(file.contents.toString(), function(err, jsonObj) {
                    if(err){
                        this.emit('error', new gutil.PluginError('gulp-csvtojson', err));
                        cb(new gutil.PluginError('gulp-csvtojson', err));
                    }

                    var output = JSON.stringify(jsonObj);
                    if (options.genjs) {
                        var variablename = getVariableName(file,options)
                        output = "var "+variablename + " = " + output + ";";
                    }
                    file.contents = new Buffer(output);
                    onComplete(self,file,options,cb);
                });
            }
        } catch (err) {
            this.emit('error', new gutil.PluginError('gulp-csvtojson', err));
            cb(new gutil.PluginError('gulp-csvtojson', err));
        }
    });
};
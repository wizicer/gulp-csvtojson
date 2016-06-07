'use strict';
var path = require('path');
var gutil = require('gulp-util');
var through = require('through2');
var Converter=require("csvtojson").Converter;

var getVariableName = function(file,options){
    if (typeof(options.globalvariable) !== "undefined" && options.globalvariable !== null){
        return options.globalvariable;
    }

    return path.basename(file.path, path.extname(file.path));
};

var onComplete = function(stream,file,options,done){
    if (options.genjs){
        file.path = gutil.replaceExtension(file.path,'.js');
    }
    else{
        file.path = gutil.replaceExtension(file.path,'.json');
    }

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

var processStream = function(file,options,cb){
    options.toArrayString=true;
    options.constructResult=false;
    var csvConverter = new Converter(options);

    file.contents = file.contents.pipe(csvConverter);
    if (options.genjs) {
        var variablename = getVariableName(file,options);
        file.contents = file.contents.pipe(generateJsStream(variablename));
    }
    cb();
};

var processBuffer = function(file,options,cb){
    var csvConverter = new Converter(options);
                
    csvConverter.fromString(file.contents.toString(), function(err, jsonObj) {
        if(err){
            return cb(err);
        }

        var output = JSON.stringify(jsonObj);
        if (options.genjs) {
            var variablename = getVariableName(file,options);
            output = "var "+variablename + " = " + output + ";";
        }
        file.contents = new Buffer(output);
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
            return cb(null, file);
        }
        
        try {
            var done = function(err){
                if(err){ throw err; }
                onComplete(self,file,options,cb);
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
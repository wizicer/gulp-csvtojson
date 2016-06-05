'use strict';
var assert = require('assert');
var gutil = require('gulp-util');
var csvtojson = require('./');
var gulpCsvtojson = require('./');
var File = require('vinyl');
var Readable = require('stream').Readable;
var concat = require('concat-stream');

var input = "fieldA.title, fieldA.children[0].name, fieldA.children[0].id,fieldA.children[1].name, fieldA.children[1].employee[].name,fieldA.children[1].employee[].name, fieldA.address[],fieldA.address[], description\n" +
            "Food Factory, Oscar, 0023, Tikka, Tim, Joe, 3 Lame Road, Grantstown, A fresh new food factory\n" +
            "Kindom Garden, Ceil, 54, Pillow, Amst, Tom, 24 Shaker Street, HelloTown, Awesome castle";

var expected = '[{"fieldA":{"title":"Food Factory","children":[{"name":"Oscar","id":23},{"name":"Tikka","employee":[{"name":"Tim"},{"name":"Joe"}]}],"address":["3 Lame Road","Grantstown"]},"description":"A fresh new food factory"},{"fieldA":{"title":"Kindom Garden","children":[{"name":"Ceil","id":54},{"name":"Pillow","employee":[{"name":"Amst"},{"name":"Tom"}]}],"address":["24 Shaker Street","HelloTown"]},"description":"Awesome castle"}]';

var stringToStream = function(string){
    var rs = new Readable();
    rs.push(string);
    rs.push(null);
    
    return rs;
}

describe("Given we are using gulp-csvtojson",function(){
    describe("Given csv data",function(){
        var csvData = "Header1,Header2,Header3\n"+
                        "col1-row1,col2-row1,col3-row1\n"+
                        "col1-row2,col2-row2,col3-row2";
        
        describe("When using a Buffer",function(){
            var file = null;
            var file2 = null;
            beforeEach(function(){
                file = new File({
                    path : 'any.csv',
                    contents : new Buffer(csvData)
                });
                file2 = new File({
                    path : 'file.csv',
                    contents : new Buffer(input)
                });
            });
            describe("When using default options",function(){
                var csvtojsonStream = null;
                beforeEach(function(){
                    csvtojsonStream = gulpCsvtojson();
                });

                it("should generate expected json string",function(done){
                    var expectedResult = JSON.stringify([{"Header1":"col1-row1","Header2":"col2-row1","Header3":"col3-row1"},{"Header1":"col1-row2","Header2":"col2-row2","Header3":"col3-row2"}]);
                    
                    csvtojsonStream.once('data',function(file){
                        assert(file.contents.toString() == expectedResult);
                        done();
                    });
                    csvtojsonStream.write(file);
                    csvtojsonStream.end();
                });

                it('should return json when no options', function (done) {
                    csvtojsonStream.once('data',function(file){
                        assert(file.contents.toString() == expected);
                        done();
                    });

                    csvtojsonStream.write(file2);
                    csvtojsonStream.end();
                });

                it("should rename path to a json file",function(done){
                    csvtojsonStream.on('data',function(file){
                        assert.equal(file.relative,'any.json');
                        done();
                    });

                    csvtojsonStream.write(file);
                    csvtojsonStream.end();
                });
            });
            describe("When using generate js options",function(){
                var csvtojsonStream = null;
                beforeEach(function(){
                    csvtojsonStream = gulpCsvtojson({ globalvariable: null, genjs: true });
                });

                it("should return js when globalvariable is set null",function(done){                    
                    csvtojsonStream.once('data',function(file){
                        assert(file.contents.toString(), "file=" + expected + ";");
                        done();
                    });

                    csvtojsonStream.write(file2);
                    csvtojsonStream.end();
                });

            });
            describe("When setting globalvariable option without genjs",function(){
                var csvtojsonStream = null;
                beforeEach(function(){
                    csvtojsonStream = gulpCsvtojson({ globalvariable: 'gv'});
                });

                it("should return js when globalvariable is set null",function(done){                    
                    csvtojsonStream.once('data',function(file){
                        assert(file.contents.toString(),  expected );
                        done();
                    });

                    csvtojsonStream.write(file2);
                    csvtojsonStream.end();
                });

            });
            describe("When setting globalvariable option with genjs",function(){
                var csvtojsonStream = null;
                beforeEach(function(){
                    csvtojsonStream = gulpCsvtojson({ globalvariable: 'gv', genjs: true });
                });

                it("should return js when globalvariable is set null",function(done){                    
                    csvtojsonStream.once('data',function(file){
                        assert(file.contents.toString(),  "gv=" + expected + ";" );
                        done();
                    });

                    csvtojsonStream.write(file2);
                    csvtojsonStream.end();
                });

            });
        });

        describe("When using a Stream",function(){
            var file = null;
            beforeEach(function(){
                file = new File({
                    path : 'any.csv',
                    contents : stringToStream(csvData)
                });
            });
            describe("When using default options",function(){
                var csvtojsonStream = null;
                beforeEach(function(){
                    csvtojsonStream = gulpCsvtojson();
                });

                it("should generate expected json string",function(done){
                    var expectedResult = [{"Header1":"col1-row1","Header2":"col2-row1","Header3":"col3-row1"},{"Header1":"col1-row2","Header2":"col2-row2","Header3":"col3-row2"}];
                    csvtojsonStream.on('data',function(file){
                        file.contents.pipe(concat(function(data){
                            assert(JSON.stringify(JSON.parse(data.toString())) == JSON.stringify(expectedResult));
                            done();
                        }));
                    });
                    csvtojsonStream.write(file);
                    csvtojsonStream.end();
                });
                it("should rename path to a json file",function(done){
                    csvtojsonStream.on('data',function(file){
                        assert.equal(file.relative,'any.json');
                        done();
                    });

                    csvtojsonStream.write(file);
                    csvtojsonStream.end();
                });
            });

            describe("When defining generate js option",function(){
                var csvtojsonStream = null;
                beforeEach(function(){
                    csvtojsonStream = gulpCsvtojson({genjs:true});
                });

                it("should generate expected json string",function(done){

                    var expectedResult = 'var any = [{"Header1":"col1-row1","Header2":"col2-row1","Header3":"col3-row1"},{"Header1":"col1-row2","Header2":"col2-row2","Header3":"col3-row2"}];';
                    csvtojsonStream.on('data',function(file){
                        file.contents.pipe(concat(function(data){
                            assert(data.toString().replace(/\s\n/g,'') == expectedResult);
                            done();
                        }));
                    });
                    csvtojsonStream.write(file);
                    csvtojsonStream.end();
                });
                it("should rename path to a js file",function(done){
                    csvtojsonStream.on('data',function(file){
                        assert.equal(file.relative,'any.js');
                        done();
                    });

                    csvtojsonStream.write(file);
                    csvtojsonStream.end();
                });
            }); 
        });                        
    })
});

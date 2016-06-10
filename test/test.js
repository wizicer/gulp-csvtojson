'use strict';
var gulpCsvtojson = require('../');
var fileFixture = require('./fixtures/fileFixture');
var csvDataFixture = require('./fixtures/csvDataFixture');
var assert = require('assert');

describe("Given we are using gulp-csvtojson", function() {
    fileFixture.forEach(function(fileData) {
        describe("When using a " + fileData.name, function() {
            describe("When using default options", function() {
                csvDataFixture.forEach(function(csvData) {
                    describe("When CSV has Data: " + csvData.name, function() {
                        var file = null;
                        var csvtojsonStream = null;

                        beforeEach(function() {
                            file = fileData.getFile(csvData.csv);
                            csvtojsonStream = gulpCsvtojson();
                        });

                        it("should generate expected json string", function(done) {
                            csvtojsonStream.once('data',function(streamedfile) {
                                fileData.getData(streamedfile, function(data) {
                                    assert.equal(data, JSON.stringify(csvData.expected));
                                    done();
                                });
                            });
                            csvtojsonStream.write(file);
                            csvtojsonStream.end();
                        });
                        it("should rename path to a json file", function(done) {
                            csvtojsonStream.on('data', function(streamedfile) {
                                assert.equal(streamedfile.relative,'any.json');
                                done();
                            });

                            csvtojsonStream.write(file);
                            csvtojsonStream.end();
                        });
                    });
                });

            });
        });
    });
});

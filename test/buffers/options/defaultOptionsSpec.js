'use strict';
var assert = require('assert');
var concat = require('concat-stream');
var gulpCsvtojson = require('../../../');
var fileFixture = require('../../fixtures/fileFixture');
var csvDataFixture = require('../../fixtures/csvDataFixture');

module.exports = function(){
    describe("When using default options",function(){
        csvDataFixture.forEach(function(csvData){
			describe("When CSV has Data: "+csvData.name,function(){
		        var file = null;
		        var csvtojsonStream = null;

		        beforeEach(function(){
					file = fileFixture.buffer(csvData.csv);
		            csvtojsonStream = gulpCsvtojson();
		        });

		        it("should generate expected json string "+csvData.name,function(done){
		            csvtojsonStream.once('data',function(streamedfile){
		                assert.equal(streamedfile.contents.toString(), JSON.stringify(csvData.expected));
		                done();
		            });
		            csvtojsonStream.write(file);
		            csvtojsonStream.end();
		        });
		        it("should rename path to a json file"+csvData.name,function(done){
		            csvtojsonStream.on('data',function(streamedfile){
		                assert.equal(streamedfile.relative,'any.json');
		                done();
		            });

		            csvtojsonStream.write(file);
		            csvtojsonStream.end();
		        });
	        });
		});

    });
};
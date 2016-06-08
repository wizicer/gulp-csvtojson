var assert = require('assert');
var concat = require('concat-stream');
var gulpCsvtojson = require('../../../');
var fileFixture = require('../../fixtures/fileFixture');
var csvDataFixture = require('../../fixtures/csvDataFixture');

'use strict';
module.exports = function(){
    describe("When using js options",function(){
        csvDataFixture.forEach(function(csvData){
			describe("When CSV has Data: "+csvData.name,function(){
		        var file = null;
		       
		        beforeEach(function(){
					file = fileFixture.stream(csvData.csv);
		        });

	    		describe("When globalvariable is not set",function(){
	    			var csvtojsonStream = null;

			        beforeEach(function(){
			            csvtojsonStream = gulpCsvtojson({genjs: true });
			        });
	                it("should return js with variable name set to file name",function(done){                    
	                    csvtojsonStream.once('data',function(streamedfile){
							streamedfile.contents.pipe(concat(function(data){
								var expected = "var any = " + JSON.stringify(csvData.expected)+";";
								assert.equal(data.toString().replace(/\s?\n/g,''), expected);
								done();
							}));
	                    });

	                    csvtojsonStream.write(file);
	                    csvtojsonStream.end();
	                });
				});
	    		describe("When globalvariable is not set",function(){
	    			var csvtojsonStream = null;
	    			
			        beforeEach(function(){
			            csvtojsonStream = gulpCsvtojson({genjs: true,globalvariable: 'gv' });
			        });
	                it("should return js with variable name set to file name",function(done){                    
	                    csvtojsonStream.once('data',function(streamedfile){
							streamedfile.contents.pipe(concat(function(data){
								var expected = "var gv = " + JSON.stringify(csvData.expected)+";";
								assert.equal(data.toString().replace(/\s?\n/g,''),expected );
								done();
							}));
	                    });

	                    csvtojsonStream.write(file);
	                    csvtojsonStream.end();
	                });
				});
	        });
		});

    });
};
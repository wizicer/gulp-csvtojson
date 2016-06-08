'use strict';
var streamSpecs = require('./streams/streamSpec');
var bufferSpecs = require('./buffers/bufferSpec');

describe("Given we are using gulp-csvtojson",function(){
	streamSpecs();
	bufferSpecs();
});
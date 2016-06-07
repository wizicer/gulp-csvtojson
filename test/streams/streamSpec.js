'use strict';
var defaultOptionsSpec = require('./options/defaultOptionsSpec');
var jsOptionsSpec = require('./options/jsOptionsSpec');

module.exports = function(){
	describe("When using a Stream",function(){
		jsOptionsSpec();
		defaultOptionsSpec();
	});
}
'use strict';
var jsOptionsSpec = require('./options/jsOptionsSpec');
var defaultOptionsSpec = require('./options/defaultOptionsSpec');

module.exports = function(){
	describe("When using a Buffer",function(){
		defaultOptionsSpec();
		jsOptionsSpec();
	});
}
'use strict';
var defaultOptionsSpec = require('./options/defaultOptionsSpec');

module.exports = function(){
	describe("When using a Buffer",function(){
		defaultOptionsSpec();
	});
}

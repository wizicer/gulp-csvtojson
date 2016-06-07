var File = require('vinyl');
var Readable = require('stream').Readable;

var stringToStream = function(string){
    var rs = new Readable();
    rs.push(string);
    rs.push(null);
    
    return rs;
};

module.exports = {
	stream : function(data){
				return new File({
                    path : 'any.csv',
                    contents : stringToStream(data)
                })
			},
	buffer :  function(data){
				return new File({
                    path : 'any.csv',
                    contents : new Buffer(data)
                })
			}
};
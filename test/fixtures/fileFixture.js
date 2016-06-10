var File = require('vinyl');
var Readable = require('stream').Readable;
var concat = require('concat-stream');

var stringToStream = function(string) {
    var rs = new Readable();
    rs.push(string);
    rs.push(null);
    
    return rs;
};

module.exports = [
    {
        name : "Stream",
        getFile : function(data) {
            return new File({
                path : 'any.csv',
                contents : stringToStream(data)
            });
        },
        getData : function(streamedfile, done) {
            streamedfile.contents.pipe(concat(function(data) {
                done(JSON.stringify(JSON.parse(data.toString())));
            }));
        }
    },
    {
        name : "buffer", 
        getFile : function(data) {
            return new File({
                path : 'any.csv',
                contents : new Buffer(data)
            });
        },
        getData : function(streamedfile, done) {
            done(streamedfile.contents.toString());
        }
    }
];

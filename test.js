'use strict';
var assert = require('assert');
var gutil = require('gulp-util');
var csvtojson = require('./');

var input = "fieldA.title, fieldA.children[0].name, fieldA.children[0].id,fieldA.children[1].name, fieldA.children[1].employee[].name,fieldA.children[1].employee[].name, fieldA.address[],fieldA.address[], description\n" +
            "Food Factory, Oscar, 0023, Tikka, Tim, Joe, 3 Lame Road, Grantstown, A fresh new food factory\n" +
            "Kindom Garden, Ceil, 54, Pillow, Amst, Tom, 24 Shaker Street, HelloTown, Awesome castle";

var expected = '[{"fieldA":{"title":"Food Factory","children":[{"name":"Oscar","id":"0023"},{"name":"Tikka","employee":[{"name":"Tim"},{"name":"Joe"}]}],"address":["3 Lame Road","Grantstown"]},"description":"A fresh new food factory"},{"fieldA":{"title":"Kindom Garden","children":[{"name":"Ceil","id":54},{"name":"Pillow","employee":[{"name":"Amst"},{"name":"Tom"}]}],"address":["24 Shaker Street","HelloTown"]},"description":"Awesome castle"}]';

it('should return json when no options', function (cb) {
    var stream = csvtojson();

    stream.on('data', function (file) {
        assert.strictEqual(file.contents.toString(), expected);
        assert.strictEqual(file.path.slice(file.path.indexOf('.')), '.json');
    });

    stream.on('end', cb);

    stream.write(new gutil.File({
        base: __dirname,
        path: __dirname + '/file.csv',
        contents: new Buffer(input)
    }));

    stream.end();
});

it('should return js when globalvariable is set', function (cb) {
    var stream = csvtojson({ globalvariable: 'gv' });

    stream.on('data', function (file) {
        assert.strictEqual(file.contents.toString(), "gv=" + expected + ";");
        assert.strictEqual(file.path.slice(file.path.indexOf('.')), '.js');
    });

    stream.on('end', cb);

    stream.write(new gutil.File({
        base: __dirname,
        path: __dirname + '/file.csv',
        contents: new Buffer(input)
    }));

    stream.end();
});

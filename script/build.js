'use strict';

var fs = require('fs');
var path = require('path');
var https = require('https');
var cheerio = require('cheerio');
var bail = require('bail');
var map = require('..');

https
  .get('https://html.spec.whatwg.org/multipage/infrastructure.html', function (res) {
    var value = '';

    res
      .setEncoding('utf8')
      .on('data', function (buf) {
        value += buf;
      })
      .on('end', function () {
        var node = cheerio.load(value)('#namespaces').next();
        var name;
        var data;

        while (node.get(0).name === 'p') {
          name = node.find('dfn').get(0).attribs.id;
          data = node.find('code').get(0).children[0].data;

          map[name.slice(0, name.indexOf('-'))] = data;

          node = node.next();
        }

        fs.writeFile(
          path.join(__dirname, '..', 'index.json'),
          JSON.stringify(map, 0, 2) + '\n',
          bail
        );
      });
  });

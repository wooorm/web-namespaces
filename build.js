'use strict';

var fs = require('fs');
var jsdom = require('jsdom');
var bail = require('bail');
var map = require('./');

jsdom.env('https://infra.spec.whatwg.org/#html-namespace', function (err, window) {
  bail(err);

  var $node = window.document.getElementById('namespaces').nextElementSibling;
  var name;
  var data;

  while ($node.tagName === 'P') {
    name = $node.querySelector('dfn').id;
    data = $node.querySelector('code').textContent;

    map[name.slice(0, name.indexOf('-'))] = data;

    $node = $node.nextElementSibling;
  }

  fs.writeFileSync('index.json', JSON.stringify(map, 0, 2) + '\n');
});

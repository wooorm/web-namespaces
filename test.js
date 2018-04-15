'use strict';

var assert = require('assert');
var test = require('tape');
var webNamespaces = require('.');

test('webNamespaces', function (t) {
  t.equal(typeof webNamespaces, 'object', 'should be an `object`');

  t.doesNotThrow(
    function () {
      Object.keys(webNamespaces).forEach(function (key) {
        assert(typeof webNamespaces[key], 'string', key);
      });
    },
    'should be all `string`s'
  );

  t.end();
});

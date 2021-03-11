'use strict'

var assert = require('assert')
var test = require('tape')
var webNamespaces = require('.')

var own = {}.hasOwnProperty

test('webNamespaces', function (t) {
  t.equal(typeof webNamespaces, 'object', 'should be an `object`')

  t.doesNotThrow(function () {
    var key

    for (key in webNamespaces) {
      if (own.call(webNamespaces, key)) {
        assert.equal(typeof webNamespaces[key], 'string', key)
      }
    }
  }, 'should be all `string`s')

  t.end()
})

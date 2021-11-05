import assert from 'node:assert'
import test from 'tape'
import {webNamespaces} from './index.js'

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

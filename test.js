import assert from 'node:assert/strict'
import test from 'node:test'
import {webNamespaces} from './index.js'

const own = {}.hasOwnProperty

test('webNamespaces', function () {
  assert.equal(typeof webNamespaces, 'object', 'should be an `object`')

  /** @type {string} */
  let key

  for (key in webNamespaces) {
    if (own.call(webNamespaces, key)) {
      assert.equal(typeof webNamespaces[key], 'string', key)
    }
  }
})

/**
 * @author Titus Wormer
 * @copyright 2016 Titus Wormer
 * @license MIT
 * @module web-namespaces
 * @fileoverview Test suite for `web-namespaces`.
 */

'use strict';

/* eslint-env node */

/*
 * Module dependencies.
 */

var test = require('tape');
var webNamespaces = require('./index.js');

/*
 * Tests.
 */

test('webNamespaces', function (t) {
    var key;

    t.ok(
        typeof webNamespaces === 'object',
        'should be an `object`'
    );

    for (key in webNamespaces) {
        t.equal(
            typeof webNamespaces[key],
            'string',
            '`' + key + '` should refer to a `string`'
        );
    }

    t.end();
});

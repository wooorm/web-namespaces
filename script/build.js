/**
 * @author Titus Wormer
 * @copyright 2016 Titus Wormer
 * @license MIT
 * @module web-namespaces:script:build
 * @fileoverview Crawl the tables.
 */

'use strict';

/* eslint-env node */

/*
 * Dependencies.
 */

var fs = require('fs');
var path = require('path');
var https = require('https');
var cheerio = require('cheerio');
var bail = require('bail');
var map = require('..');

/*
 * Input / output locations.
 */

var input = 'https://html.spec.whatwg.org/multipage/infrastructure.html';
var output = path.join(__dirname, '..', 'index.json');

/*
 * Crawl WhatWG.
 */

https.get(input, function (res, err) {
    var value = '';

    if (err) {
        bail(err);
    }

    res
        .setEncoding('utf8')
        .on('data', function (buf) {
            value += buf;
        }).on('end', function () {
            var node = cheerio.load(value)('#namespaces').next();
            var name;
            var data;

            while (node.get(0).name === 'p') {
                name = node.find('dfn').get(0).attribs.id;
                data = node.find('code').get(0).children[0].data;

                map[name.slice(0, name.indexOf('-'))] = data;

                node = node.next();
            }

            fs.writeFile(output, JSON.stringify(map, 0, 2) + '\n', bail);
        });
});

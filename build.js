'use strict'

var fs = require('fs')
var https = require('https')
var bail = require('bail')
var concat = require('concat-stream')
var unified = require('unified')
var parse = require('rehype-parse')
var q = require('hast-util-select')
var toString = require('hast-util-to-string')
var map = require('.')

var proc = unified().use(parse)

https.get('https://infra.spec.whatwg.org/#html-namespace', onconnection)

function onconnection(res) {
  res.pipe(concat(onconcat)).on('error', bail)
}

function onconcat(buf) {
  var nodes = q.select('main', proc.parse(buf)).children
  var length = nodes.length
  var index = -1
  var found
  var node
  var name
  var data

  while (++index < length) {
    node = nodes[index]

    if (found) {
      if (q.matches('p', node)) {
        name = q.select('dfn', node).properties.id
        data = toString(q.select('code', node))
        map[name.slice(0, name.indexOf('-'))] = data
      } else if (node.type === 'element') {
        break
      }
    } else if (q.matches('#namespaces', node)) {
      found = true
    }
  }

  fs.writeFileSync('index.json', JSON.stringify(map, null, 2) + '\n')
}

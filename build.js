import fs from 'fs'
import https from 'https'
import bail from 'bail'
import concat from 'concat-stream'
import unified from 'unified'
import parse from 'rehype-parse'
import q from 'hast-util-select'
import toString from 'hast-util-to-string'
import {webNamespaces} from './index.js'

var proc = unified().use(parse)

https.get('https://infra.spec.whatwg.org/#html-namespace', onconnection)

function onconnection(response) {
  response.pipe(concat(onconcat)).on('error', bail)
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
        webNamespaces[name.slice(0, name.indexOf('-'))] = data
      } else if (node.type === 'element') {
        break
      }
    } else if (q.matches('#namespaces', node)) {
      found = true
    }
  }

  fs.writeFileSync(
    'index.js',
    'export var webNamespaces = ' +
      JSON.stringify(webNamespaces, null, 2) +
      '\n'
  )
}

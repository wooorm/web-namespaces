import fs from 'node:fs'
import https from 'node:https'
import {bail} from 'bail'
import concat from 'concat-stream'
import {unified} from 'unified'
import parse from 'rehype-parse'
import {matches, select} from 'hast-util-select'
import {toString} from 'hast-util-to-string'
import {webNamespaces} from './index.js'

const proc = unified().use(parse)

https.get('https://infra.spec.whatwg.org/#html-namespace', onconnection)

function onconnection(response) {
  response.pipe(concat(onconcat)).on('error', bail)
}

function onconcat(buf) {
  const nodes = select('main', proc.parse(buf)).children
  const length = nodes.length
  let index = -1
  let found = false

  while (++index < length) {
    const node = nodes[index]

    if (found) {
      if (matches('p', node)) {
        const name = String(select('dfn', node).properties.id || '')
        const data = toString(select('code', node))
        webNamespaces[name.slice(0, name.indexOf('-'))] = data
      } else if (node.type === 'element') {
        break
      }
    } else if (matches('#namespaces', node)) {
      found = true
    }
  }

  fs.writeFileSync(
    'index.js',
    'export const webNamespaces = ' +
      JSON.stringify(webNamespaces, null, 2) +
      '\n'
  )
}

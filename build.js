import assert from 'node:assert/strict'
import fs from 'node:fs/promises'
import fetch from 'node-fetch'
import {fromHtml} from 'hast-util-from-html'
import {matches, select} from 'hast-util-select'
import {toString} from 'hast-util-to-string'
import {webNamespaces} from './index.js'

const response = await fetch('https://infra.spec.whatwg.org/#html-namespace')
const text = await response.text()
const tree = fromHtml(text)

const main = select('main', tree)
assert(main, 'expected main element')
let index = -1
let found = false

while (++index < main.children.length) {
  const node = main.children[index]

  if (found) {
    if (matches('p', node)) {
      const dfn = select('dfn', node)
      const code = select('code', node)
      assert(dfn, 'expected definition')
      assert(code, 'expected code')
      const name = String((dfn.properties || {}).id || '')
      const data = toString(code)
      webNamespaces[name.slice(0, name.indexOf('-'))] = data
    } else if (node.type === 'element') {
      break
    }
  } else if (matches('#namespaces', node)) {
    found = true
  }
}

await fs.writeFile(
  'index.js',
  [
    '/**',
    ' * Map of web namespaces.',
    ' *',
    ' * @type {Record<string, string>}',
    ' */',
    'export const webNamespaces = ' + JSON.stringify(webNamespaces, null, 2),
    ''
  ].join('\n')
)

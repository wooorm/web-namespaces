import assert from 'node:assert'
import fs from 'node:fs'
import https from 'node:https'
import {bail} from 'bail'
import concatStream from 'concat-stream'
import {unified} from 'unified'
import rehypeParse from 'rehype-parse'
import {matches, select} from 'hast-util-select'
import {toString} from 'hast-util-to-string'
import {webNamespaces} from './index.js'

const processor = unified().use(rehypeParse)

https.get('https://infra.spec.whatwg.org/#html-namespace', (response) => {
  response
    .pipe(
      concatStream((buf) => {
        const main = select('main', processor.parse(buf))
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

        fs.writeFileSync(
          'index.js',
          [
            '/**',
            ' * Map of web namespaces.',
            ' *',
            ' * @type {Record<string, string>}',
            ' */',
            'export const webNamespaces = ' +
              JSON.stringify(webNamespaces, null, 2),
            ''
          ].join('\n')
        )
      })
    )
    .on('error', bail)
})

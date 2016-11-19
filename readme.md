# web-namespaces [![Build Status][build-badge]][build-page]

Map of web namespaces.

## Installation

[npm][]:

```bash
npm install web-namespaces
```

**web-namespaces** is also available as an AMD, CommonJS, and globals
module, [uncompressed and compressed][releases].

## Usage

```javascript
var webNamespaces = require('web-namespaces');

console.log(webNamespaces);
```

Yields:

```js
{ html: 'http://www.w3.org/1999/xhtml',
  mathml: 'http://www.w3.org/1998/Math/MathML',
  svg: 'http://www.w3.org/2000/svg',
  xlink: 'http://www.w3.org/1999/xlink',
  xml: 'http://www.w3.org/XML/1998/namespace',
  xmlns: 'http://www.w3.org/2000/xmlns/' }
```

## API

### `webNamespaces`

`Object.<string, string>` — Map of short-name to namespaces.

## License

[MIT][license] © [Titus Wormer][author]

<!-- Definition -->

[build-badge]: https://img.shields.io/travis/wooorm/web-namespaces.svg

[build-page]: https://travis-ci.org/wooorm/web-namespaces

[npm]: https://docs.npmjs.com/cli/install

[releases]: https://github.com/wooorm/web-namespaces/releases

[license]: LICENSE

[author]: http://wooorm.com

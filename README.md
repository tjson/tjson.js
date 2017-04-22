# tjson-js [![npm version][npm-version]][npm-link] [![Build Status][build-image]][build-link] [![MIT licensed][license-image]][license-link]

[npm-version]: https://badge.fury.io/js/tjson-js.svg
[npm-link]: https://www.npmjs.com/package/tjson-js
[build-image]: https://secure.travis-ci.org/tjson/tjson-js.svg?branch=master
[build-link]: https://travis-ci.org/tjson/tjson-js
[license-image]: https://img.shields.io/badge/license-MIT-blue.svg
[license-link]: https://github.com/tjson/tjson-ruby/blob/master/LICENSE.txt

JavaScript-compatible implementation of [Tagged JSON (TJSON)][TJSON],
written in TypeScript.

[TJSON] is a microformat which supplements JSON with a set of type tags in the
keys of objects, allowing it to represent a wider range of data types than
is ordinarily possible in JSON:

```json
{
  "array-example:A<O>": [
    {
      "string-example:s": "foobar",
      "binary-example:b64": "QklOQVJZ",
      "float-example:f": 0.42,
      "int-example:i": "42",
      "timestamp-example:t": "2016-11-06T22:27:34Z",
      "value-example:v": true
    }
  ],
  "set-example:S<i>": [1, 2, 3]
}
```

[TJSON]: https://www.tjson.org

## Installation

Via [npm](https://www.npmjs.com/):

```bash
npm install tjson-js
```

Via [Yarn](https://yarnpkg.com/):

```bash
yarn install tjson-js
```

## API

### TJSON.parse()

The `TJSON.parse()` method parses a TJSON string, returning an [Object]
described by the string. This method is analogous to JavaScript's built-in
[JSON.parse()] method.

```
TJSON.parse(tjsonString[, decodeUTF8 = true])
```

[JSON.parse()]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse

#### Parameters

* **tjsonString**: The string to parse, containing data serialized as [TJSON].

* **decodeUTF8**: instructs whether or not to first decode the TJSON string from
UTF-8 before parsing it. By default UTF-8 will be automatically decoded to the
engine's internal string representation (e.g. UCS-2). If you would like to skip
automatic encoding conversions (e.g. because they happen at the I/O boundary)
pass `false`.

#### Example

```js
TJSON.parse('{"some-string-data:s":"Hello, world!","some-time-ago:t":"2017-04-22T20:40:53.182Z"}');
//→ Object { some-string-data: "Hello, world!", some-time-ago: Sat Apr 22 2017 13:40:53 GMT-0700 (PDT) }
```

### TJSON.stringify()

The `TJSON.stringify()` method converts a JavaScript value to a TJSON string.
This method is analogous to JavaScript's built-in [JSON.stringify()] method.

```
TJSON.stringify(value[, space = 0[, encodeUTF8 = true]])
```

[JSON.stringify()]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify

#### Parameters

* **value**: The value to convert to a TJSON string.

* **space**: a [String] or [Number] object that's to insert white space into the
output JSON string for readability purposes. For more information, please see
the [JSON.stringify()] documentation.

* **encodeUTF8**: instructs whether or not to encode the resulting document as
UTF-8. The TJSON specification requires all confirming documents are encoded
as UTF-8. If you would like to skip automatic encoding conversions (e.g.
because they happen at the I/O boundary) pass `false`.

## Type Conversions

TJSON types are converted to/from JavaScript types as follows:

* `O` => [Object]
* `A` => [Array]
* `S` => [Set]
* `i` => [Number] (NOTE: When available this will switch to the [TC39 Integer] type)
* `u` => [Number] (NOTE: When available this will switch to the [TC39 Integer] type)
* `f` => [Number]
* `s` => [String]
* `t` => [Date]
* `v` => [Boolean]

[Object]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Objects
[Array]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Indexed_collections_Arrays_and_typed_Arrays
[Set]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set
[Number]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type
[TC39 Integer]: https://tc39.github.io/proposal-integer/
[String]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type
[Date]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date
[Boolean]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type

## License

Copyright (c) 2017 Tony Arcieri. Distributed under the MIT License. See
[LICENSE.txt](https://github.com/tjson/tjson-js/blob/master/LICENSE.txt)
for further details.

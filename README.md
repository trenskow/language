@trenskow/language
----

A small library for getting a full language identifier ([RFC 5646](https://tools.ietf.org/html/rfc5646)).

# Usage

```javascript
const { expand, collapse, match } = require('@trenskow/language');
```

## `expand(identifier)`

Takes an RFC 5646 string and expands it to include language, script and country.

### Example

```javascript
expand('da'); // Returns 'da-Latn-DK'
expand('en-US'); // Returns 'en-Latn-US
```

## `collapse(identifier)`

Takes a (partially) full RFC 5646 string and reduces it to its minimum value.

### Example

```javascript
collapse('da-Latn-DK'); // Returns 'da'
collapse('da-DK') // Returns 'da'
collapse('en-US') // Returns 'en-US'
```

## `match(identifier, supported, [default])`

Takes an HTTP `Accept-Header` value value and returns the language to use based on an array of supported languages.

> If `default` is omitted the first supported language becomes the default.

### Example

```javascript
match('da, en-US; en-GB;q=0.8, en', ['da', 'en-US'], 'en-US'); // Returns 'da'
match('en-GB;q=0.8, en', ['en-US', 'da-DK']); // returns 'en-US'
match('de-DE', ['da-DK', 'en-US'], 'en-US'); // Returns 'en-US'
```

# License

See LICENSE.

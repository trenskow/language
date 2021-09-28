@trenskow/language
----

A small library for getting a full language identifier ([RFC 5646](https://tools.ietf.org/html/rfc5646)).

# Usage

```javascript
const { expand, collapse, match, all } = require('@trenskow/language');
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

## `all`

Returns all posible identifier combinations.

### Example

```javascript
all /*
	[
    'af-Latn-NA', 'af-NA',      'af-Latn-ZA', 'af-ZA',      'am-Ethi-ET',
    'am-ET',      'am',         'ar-Arab-AE', 'ar-Arab-BH', 'ar-Arab-DJ',
    'ar-Arab-DZ', 'ar-Arab-EG', 'ar-Arab-EH', 'ar-Arab-ER', 'ar-Arab-IL',
    'ar-Arab-IQ', 'ar-Arab-JO', 'ar-Arab-KM', 'ar-Arab-KW', 'ar-Arab-LB',
    'ar-Arab-LY', 'ar-Arab-MA', 'ar-Arab-MR', 'ar-Arab-OM', 'ar-Arab-PS',
    'ar-Arab-QA', 'ar-Arab-SA', 'ar-Arab-SD', 'ar-Arab-SO', 'ar-Arab-SY',
    'ar-Arab-TD', 'ar-Arab-TN', 'ar-Arab-YE', 'ar-Syrc-IR', 'ar-Syrc-SS',
    'ay-Latn-BO', 'ay-BO',      'ay',         'az-Arab-AZ', 'az-Cyrl-AZ',
    'az-Latn-AZ', 'be-Cyrl-BY', 'be-BY',      'be',         'bg-Cyrl-BG',
    'bg-BG',      'bg',         'bi-Latn-VU', 'bi-VU',      'bi',
    'bn-Beng-BD', 'bn-BD',      'bn',         'bs-Cyrl-BA', 'bs-Latn-BA',
    'ca-Latn-AD', 'ca-AD',      'ca',         'ch-Latn-GU', 'ch-GU',
    'ch',         'cs-Latn-CZ', 'cs-CZ',      'cs',         'da-Latn-DK',
    'da-DK',      'da',         'de-Latn-AT', 'de-AT',      'de-Latn-BE',
    'de-BE',      'de-Latn-CH', 'de-CH',      'de-Latn-DE', 'de-DE',
    'de-Latn-LI', 'de-LI',      'de-Latn-LU', 'de-LU',      'dv-Thaa-MV',
    'dv-MV',      'dv',         'dz-Tibt-BT', 'dz-BT',      'dz',
    'el-Grek-CY', 'el-CY',      'el-Grek-GR', 'el-GR',      'en-Latn-AG',
    'en-Latn-AI', 'en-Latn-AS', 'en-Latn-AU', 'en-Latn-BB', 'en-Latn-BI',
    'en-Latn-BM', 'en-Latn-BS', 'en-Latn-BW', 'en-Latn-BZ', 'en-Latn-CA',
    ... 623 more items
  ]
*/
```

# License

See LICENSE.

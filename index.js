'use strict';

const
	{ countries, languages, scripts } = require('@trenskow/localization-data');

const lowercaseKeys = (obj) => {
	return Object.keys(obj).map((key) => key.toLowerCase());
};

const
	countryIdentifiers = lowercaseKeys(countries),
	languageIdentifiers = lowercaseKeys(languages),
	scriptIdentifiers = lowercaseKeys(scripts);

const entities = (identifier) => {

	let languageIdentifier;
	let scriptIdentifier;
	let countryIdentifier;

	identifier.split('-')
		.map((part) => part.toLowerCase())
		.forEach((part) => {
			if (!languageIdentifier && languageIdentifiers.includes(part)) languageIdentifier = part.toLowerCase();
			else if (!scriptIdentifier && scriptIdentifiers.includes(part)) scriptIdentifier = part.substr(0, 1).toUpperCase() + part.substr(1).toLowerCase();
			else if (!countryIdentifier && countryIdentifiers.includes(part)) countryIdentifier = part.toUpperCase();
			else throw new Error(`Unknown entity \`${part}\`.`);
		});

	return { languageIdentifier, scriptIdentifier, countryIdentifier };

};

const scriptIdentifiersForLanguageInCountry = (languageIdentifier, countryIdentifier) => {
	return Object.keys(languages[languageIdentifier].scripts)
		.filter((scriptIdentifier) => languages[languageIdentifier].scripts[scriptIdentifier].countries.includes(countryIdentifier));
};

const expand = (identifier) => {

	if (!identifier || typeof identifier !== 'string') throw new Error('Identifier must be a string');

	let { languageIdentifier, scriptIdentifier, countryIdentifier } = entities(identifier);

	if (!languageIdentifier) throw new Error(`Language is ambiguous for identifier '${identifier}'`);

	if (!scriptIdentifier) {
		if (countryIdentifier) {
			let availableScriptIdentifiers = scriptIdentifiersForLanguageInCountry(languageIdentifier, countryIdentifier);
			if (availableScriptIdentifiers.length !== 1) availableScriptIdentifiers = availableScriptIdentifiers.filter((scriptIdentifier) => (languages[languageIdentifier].primaryScripts || []).includes(scriptIdentifier));
			if (availableScriptIdentifiers.length === 1) {
				scriptIdentifier = availableScriptIdentifiers[0];
			}
		} else {
			if ((languages[languageIdentifier].primaryScripts || []).length === 1) scriptIdentifier = languages[languageIdentifier].primaryScripts[0];
		}
		if (!scriptIdentifier) throw new Error(`Script is ambiguous for identifier '${identifier}'.`);
	}

	if (!countryIdentifier) {
		if ((languages[languageIdentifier].scripts[scriptIdentifier].countries || {}).length !== 1) throw new Error(`Country is ambiguous for identifier '${identifier}'.`);
		countryIdentifier = languages[languageIdentifier].scripts[scriptIdentifier].countries[0];
	}

	return `${languageIdentifier}-${scriptIdentifier}-${countryIdentifier}`;

};

const collapse = (identifier) => {

	const { languageIdentifier, scriptIdentifier, countryIdentifier } = entities(expand(identifier));

	let parts = [languageIdentifier];

	if (languages[languageIdentifier].primaryScripts.length > 1) parts.push(scriptIdentifier);
	if (languages[languageIdentifier].scripts[scriptIdentifier].countries.length > 1) parts.push(countryIdentifier);

	return parts.join('-');

};

const match = (identifier, supported, def) => {

	if (!identifier || typeof identifier !== 'string') throw new Error('Identifier must be a string');
	if (!Array.isArray(supported) || !supported.length || supported.some((item) => typeof item !== 'string')) throw new Error('Supported languages must be an array of language identifiers.');

	const supportedExpanded = supported.map((identifier) => expand(identifier));

	if (!def) def = supportedExpanded[0];
	else def = expand(def);

	if (!supportedExpanded.some((identifier) => identifier === def)) throw new Error('Default language is not within supported languages.');

	supportedExpanded.sort((l1, l2) => {
		if (l1 == l2) return 0;
		if (l1 !== def) return 1;
		if (l2 !== def) return -1;
	});

	// Takes a full identifier and splits it into its individual parts.
	const parts = (identifier) => {
		const parts = identifier.split('-');
		if (parts.length == 1) return { language: parts[0] };
		if (parts.length == 2) return { language: parts[0], country: parts[1] };
		return { language: parts[0], script: parts[1], country: parts[2] };
	};

	if (identifier.trim() === '*') return def;

	// Split them into each language.
	const result = (identifier
		// Split them into languages.
		.split(/, ?/)
		// Map them into identifier and quality factor.
		.map((language) => {
			const [identifier, quality] = language.split(/; ?/);
			return {
				identifier: parts(identifier),
				quality: parseFloat((quality || '').substr(2)) || 1
			};
		})
		// Take each user requested languages.
		.reduce((res, language) => {
			// Compare them to the supported languages.
			// We use a point system to determine the best match.
			return res.concat(...supportedExpanded.map((supported) => {
				let result = 0.0;
				let supportedParts = parts(supported);
				if (language.identifier.language === supportedParts.language) {
					result = 1.0;
					if (language.identifier.script && language.identifier.script !== supportedParts.script) result -= 0.25;
					if (language.identifier.country && language.identifier.country !== supportedParts.country) result -= 0.50;
				}
				// Return the language nad the point system result and multiply it with the users quality factor.
				return {
					language: supported,
					result: result * language.quality
				};
			}));
		}, [])
		// Sort them by the result – and select the first.
		.sort((l1, l2) => {
			if (l1.result > l2.result) return -1;
			if (l1.result < l2.result) return 1;
			return 0;
		})[0] || {}).language || def;

	return supported.filter((identifier) => {
		return expand(identifier) == result;
	})[0];

};

exports.entities = (identifier) => entities(expand(identifier));
exports.expand = expand;
exports.collapse = collapse;
exports.match = match;

Object.defineProperty(exports, 'all', {
	get: () => {
		return [].concat(...Object.keys(languages).map((language) => {
			return [].concat(...Object.keys(languages[language].scripts).map((script) => {
				return [].concat(...languages[language].scripts[script].countries.map((country) => {
					let result = [`${language}-${script}-${country}`];
					if (Object.keys(languages[language].scripts).length == 1) {
						result.push(`${language}-${country}`);
						if (languages[language].scripts[script].countries.length == 1) {
							result.push(language);
						}
					}
					return result;
				}));
			}));
		}));
	},
	enumerable: true
});

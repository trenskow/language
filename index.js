'use strict';

const
	{ countries, languages, scripts } = require('@trenskow/localization-data');

const entities = (identifier) => {

	let language;
	let script;
	let country;

	identifier.split('-')
		.forEach((part) => {
			if (languages[part]) language = part;
			else if (scripts[part]) script = part;
			else if (countries[part]) country = part;
			else throw new Error(`Unknown entity \`${part}\`.`);
		});

	return { language, script, country };

};

const expand = (identifier) => {

	let { language, script, country } = entities(identifier);

	if (!language) throw new Error('Language entity is missing.');

	if (!script) {
		if (languages[language].primaryScripts.length > 1) throw new Error('Script entity is missing.');
		script = languages[language].primaryScripts[0];
	}

	if (!country) {
		if (languages[language].scripts[script].countries.length > 1) throw new Error('Country entity is missing.');
		country = languages[language].scripts[script].countries[0];
	}

	return `${language}-${script}-${country}`;

};

const deduct = (identifier) => {

	const { language, script, country } = entities(expand(identifier));

	let parts = [language];

	if (languages[language].primaryScripts.length > 1) parts.push(script);
	if (languages[language].scripts[script].countries.length > 1) parts.push(country);

	return parts.join('-');

};

exports = module.exports = expand;
exports.reversed = deduct;

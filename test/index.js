'use strict';

const
	{ expect } = require('chai');

const
	language = require('../');

describe('language', () => {
	it ('should come back with `da-Latn-DK`.', () => {
		expect(language('da')).to.equal('da-Latn-DK');
	});
	it ('should come back with `da`.', () => {
		expect(language.reversed('da-Latn-DK')).to.equal('da');
	});
	it ('should throw an error if country is missing (`fr`).', () => {
		expect(() => { language('fr'); }).to.throw('Country entity is missing.');
	});
	it ('should come back with `fr-FR`.', () => {
		expect(language.reversed('fr-Latn-FR')).to.equal('fr-FR');
	});
});

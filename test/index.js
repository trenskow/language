'use strict';

const
	{ expect } = require('chai');

const
	language = require('../');

describe('language', () => {
	it ('should come back with all.', () => {
		expect(language.all).to.be.an('array').lengthOf(747);
	});
	it ('should come back with `da-Latn-DK`.', () => {
		expect(language.expand('da')).to.equal('da-Latn-DK');
	});
	it ('should come back with `da` (from `da-Latn-DK`).', () => {
		expect(language.collapse('da-Latn-DK')).to.equal('da');
	});
	it ('should come back with `da` (from `da-DK`).', () => {
		expect(language.collapse('da-DK')).to.equal('da');
	});
	it ('should throw an error if country is missing (`fr`).', () => {
		expect(() => { language.expand('fr'); }).to.throw('Country is ambiguous for identifier \'fr\'.');
	});
	it ('should come back with `fr-FR`.', () => {
		expect(language.collapse('fr-Latn-FR')).to.equal('fr-FR');
	});
	it ('should come back with `da-DK` (from `da, en-US; en-GB;q=0.5, en;q=0.2`)', () => {
		expect(language.match('da, en-US; en-GB;q=0.8, en', ['en-US', 'da-DK'])).to.equal('da-DK');
	});
	it ('should come back with `en-US` (from `en-GB;q=0.8, en`)', () => {
		expect(language.match('en-GB;q=0.8, en', ['en-US', 'da-DK'])).to.equal('en-US');
	});
	it ('should come back with `en-US` (from `de-DE`)', () => {
		expect(language.match('de-DE', ['da-DK', 'en-US'], 'en-US')).to.equal('en-US');
	});
});

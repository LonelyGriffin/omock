// @flow
import DateMockHelper from './date';

const Global = global || window || this;
const ORIGINAL_DATE = Global.Date;

describe('common › utils › mock › date', () => {
	afterEach(() => {
		Global.Date = ORIGINAL_DATE;
	});
	describe('.mockConstructor()', () => {
		it('should mock original date constructor', () => {
			const instance = new ORIGINAL_DATE(1404);
			DateMockHelper.mockConstructor(instance);
			expect(new Date(1701)).toBe(instance);
		});
	});
	describe('.OriginalDate', () => {
		it('should provide original date class', () => {
			const instance = new ORIGINAL_DATE(2205);
			DateMockHelper.mockConstructor(instance);
			expect(new DateMockHelper.OriginalDate(2070)).not.toBe(instance);
		});
	});
	describe('.unmock()', () => {
		it('should restore original date', () => {
			const instance = new ORIGINAL_DATE(2205);
			DateMockHelper.mockConstructor(instance);
			DateMockHelper.unmock();
			expect(new DateMockHelper.OriginalDate(1800)).not.toBe(instance);
		});
	});
});

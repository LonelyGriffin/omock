// @flow
import ObjectMockHelper from './object';

describe('common › utils › mock › object', () => {
	afterEach(() => {
		ObjectMockHelper.unmockAll();
	});
	describe('.mock()', () => {
		it('should mock one property', () => {
			const mockedValue = 'mocked value';
			const object = {
				property: 'original value',
			};
			ObjectMockHelper.mock(object, 'property', mockedValue);
			expect(object.property).toBe(mockedValue);
		});
		it('should throw error if object have no mocked property with passed name', () => {
			const mockedValue = 'mocked value';
			const object = {
				property: 'original value',
			};

			expect(() => {
				// $FlowFixMe
				ObjectMockHelper.mock(object, 'nonexistentProperty', mockedValue);
			}).toThrow();
		});
		it('should remock the property if already been done', () => {
			const mockedValue = 'mocked value';
			const object = {
				property: 'original value',
			};

			ObjectMockHelper.mock(object, 'property', 'first value');
			ObjectMockHelper.mock(object, 'property', mockedValue);
			expect(object.property).toBe(mockedValue);
		});
	});
	describe('.unmock()', () => {
		it('should unmock one the property', () => {
			const originalValue1 = 'original value 1';
			const mockedValue2 = 'mocked value 2';
			const object = {
				property1: originalValue1,
				property2: 'original value 2',
			};
			ObjectMockHelper.mock(object, 'property1', 'mocked value 1');
			ObjectMockHelper.mock(object, 'property2', mockedValue2);

			ObjectMockHelper.unmock(object, 'property1');

			expect(object.property1).toBe(originalValue1);
			expect(object.property2).toBe(mockedValue2);
		});
	});
	describe('.unmockObject()', () => {
		it('should unmock all property at the object', () => {
			const mockedValue1 = 'mocked value 1';
			const mockedValue2 = 'mocked value 2';
			const originalValue1 = 'original value 1';
			const originalValue2 = 'original value 2';
			const object = {
				property1: originalValue1,
				property2: originalValue2,
			};

			ObjectMockHelper.mock(object, 'property1', mockedValue1);
			ObjectMockHelper.mock(object, 'property2', mockedValue2);

			ObjectMockHelper.unmockObject(object);

			expect(object.property1).toBe(originalValue1);
			expect(object.property2).toBe(originalValue2);
		});
	});
	describe('.unmockAll()', () => {
		it('should unmock all objects', () => {
			const mockedValue1 = 'mocked value 1';
			const mockedValue2 = 'mocked value 2';
			const originalValue1 = 'original value 1';
			const originalValue2 = 'original value 2';

			const object1 = {
				property1: originalValue1,
				property2: originalValue2,
			};

			const object2 = {
				property1: originalValue1,
				property2: originalValue2,
			};

			ObjectMockHelper.mock(object1, 'property1', mockedValue1);
			ObjectMockHelper.mock(object1, 'property2', mockedValue2);
			ObjectMockHelper.mock(object2, 'property1', mockedValue1);
			ObjectMockHelper.mock(object2, 'property2', mockedValue2);

			ObjectMockHelper.unmockAll();

			expect(object1.property1).toBe(originalValue1);
			expect(object1.property2).toBe(originalValue2);
			expect(object2.property1).toBe(originalValue1);
			expect(object2.property2).toBe(originalValue2);
		});
	});
});

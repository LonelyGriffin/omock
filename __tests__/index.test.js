import * as OMock from '../dist/index';

describe('omock', () => {
	afterEach(() => {
		OMock.unmockAll();
	});
	describe('.mock()', () => {
		it('should mock one property', () => {
			const mockedValue = 'mocked value';
			const object = {
				property: 'original value',
			};
			OMock.mock(object, 'property', mockedValue);
			expect(object.property).toBe(mockedValue);
		});
		it('should throw error if object have no mocked property with passed name', () => {
			const mockedValue = 'mocked value';
			const object = {
				property: 'original value',
			};

			expect(() => {
				OMock.mock(object, 'nonexistentProperty', mockedValue);
			}).toThrow();
		});
		it('should remock the property if already been done', () => {
			const mockedValue = 'mocked value';
			const object = {
				property: 'original value',
			};

			OMock.mock(object, 'property', 'first value');
			OMock.mock(object, 'property', mockedValue);
			expect(object.property).toBe(mockedValue);
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

			OMock.mock(object1, 'property1', mockedValue1);
			OMock.mock(object1, 'property2', mockedValue2);
			OMock.mock(object2, 'property1', mockedValue1);
			OMock.mock(object2, 'property2', mockedValue2);

			OMock.unmockAll();

			expect(object1.property1).toBe(originalValue1);
			expect(object1.property2).toBe(originalValue2);
			expect(object2.property1).toBe(originalValue1);
			expect(object2.property2).toBe(originalValue2);
		});
	});
	describe('.getOriginal()', () => {
		it('should return original value', () => {
			const originalValue = 'original value';

			const object = {
				property: originalValue,
			}

			OMock.mock(object, 'property', 'mocked value');

			const actual = OMock.getOriginal(object, 'property');

			expect(actual).toBe(originalValue);
		});
		it('should return original if property not was mocked', () => {
			const originalValue = 'original value';

			const object = {
				property: originalValue,
				otherProperty: 'other value',
			}

			OMock.mock(object, 'otherProperty', 'mocked value');

			const actual = OMock.getOriginal(object, 'property');

			expect(actual).toBe(originalValue);
		});
		it('should return original if object not was mocked', () => {
			const originalValue = 'original value';
			
			const object = {
				property: originalValue,
			}

			OMock.mock(object, 'property', 'mocked value');

			const actual = OMock.getOriginal(object, 'property');

			expect(actual).toBe(originalValue);
		});
	});
});

// @flow
import DateMockHelper from './date';
import ObjectMockHelper from './object';
import * as MockExport from './index';

describe('common › utils › mock', () => {
	afterEach(() => {
		DateMockHelper.unmock();
		ObjectMockHelper.unmockAll();
	});
	it('should pass original methods and props of helpers', () => {
		expect(MockExport.mock).toBe(ObjectMockHelper.mock);
		expect(MockExport.mockDateConstructor).toBe(DateMockHelper.mockConstructor);
		expect(MockExport.OriginalDate).toBe(DateMockHelper.OriginalDate);
	});
	describe('.mockMethod()', () => {
		it('should use ObjectMockHelper for mocking a method and return jest function wrapping of a method', () => {
			const helperMethodMock = jest.fn(ObjectMockHelper.mock);
			ObjectMockHelper.mock(ObjectMockHelper, 'mock', helperMethodMock);

			const object = {
				method: () => 'original result',
			};

			const params = 'params';
			const method = () => 'mocked result';
			const methodMock = jest.fn(method);
			const actualMethod = MockExport.mockMethod(object, 'method', methodMock);

			expect(actualMethod(params)).toBe(method());
			expect(methodMock).toHaveBeenCalledWith(params);
			expect(object.method).toBe(actualMethod);
		});
	});
	describe('.mockAsyncMethod()', () => {
		it('should return promise by resolve value', () => {
			const object = {
				method: () => 'original result',
			};
			const promiseValue = 'promise value';
			const actual = MockExport.mockAsyncMethod(object, 'method', promiseValue);

			return actual.promise.then((value) => {
				expect(value).toBe(promiseValue);
			});
		});
	});
	describe('.mockAsyncMethodWithException()', () => {
		it('should return promise by reject value', () => {
			const object = {
				method: () => 'original result',
			};
			const exceptionValue = 'promise value';
			const actual = MockExport.mockAsyncMethodWithException(object, 'method', exceptionValue);

			return actual.promise.catch((e) => {
				expect(e).toBe(exceptionValue);
			});
		});
	});
});

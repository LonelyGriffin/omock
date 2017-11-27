// @flow
import DateMockHelper from './date';
import ObjectMockHelper from './object';

export const { mock } = ObjectMockHelper;
export const { mockConstructor: mockDateConstructor, OriginalDate } = DateMockHelper;

export function mockMethod(object, methodName, method) {
	const mockedFn = jest.fn(method);
	mock(object, methodName, mockedFn);
	return mockedFn;
}

export function mockAsyncMethod(object, methodName, resolveValue) {
	const promise = Promise.resolve(resolveValue);
	return {
		promise,
		fn: mockMethod(object, methodName, () => promise),
	};
}

export function mockAsyncMethodWithException(object, methodName, rejectValue) {
	const promise = Promise.reject(rejectValue);
	return {
		promise,
		fn: mockMethod(object, methodName, () => promise),
	};
}

export function unmockAll() {
	ObjectMockHelper.unmockAll();
	DateMockHelper.unmock();
}

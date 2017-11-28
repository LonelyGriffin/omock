(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(factory((global.OMock = {})));
}(this, (function (exports) { 'use strict';

const Global = global || window || undefined;
const ORIGINAL_DATE = Global.Date;

const DateMockHelper = {
	OriginalDate: ORIGINAL_DATE,
	mockConstructor: (instance) => {
		Global.Date = class extends ORIGINAL_DATE {
			constructor() {
				super();
				return instance;
			}
		};
	},
	unmock: () => {
		Global.Date = ORIGINAL_DATE;
	},
};

const mockedObjects = new Map();

const ObjectMockHelper = {
	mock(object, propertyName, propertyValue) {
		if (propertyName in object) {
			const mocked = mockedObjects.get(object) || {
				originalProps: new Map(),
				current: object,
			};
			if (!mocked.originalProps.has(propertyName)) {
				mocked.originalProps.set(propertyName, mocked.current[propertyName]);
			}
			mocked.current[propertyName] = propertyValue;
			mockedObjects.set(object, mocked);
		} else {
			throw new Error(`Object mock failed: object have no property ${propertyName}`);
		}
	},
	unmock(object, propertyName) {
		const mocked = mockedObjects.get(object);
		if (mocked) {
			if (propertyName in mocked.current && mocked.originalProps.has(propertyName)) {
				mocked.current[propertyName] = mocked.originalProps.get(propertyName);
				mocked.originalProps.delete(propertyName);
			}
			mockedObjects.set(object, mocked);
		}
	},
	unmockObject(object) {
		const mocked = mockedObjects.get(object);
		if (mocked) {
			mocked.originalProps.forEach((value, key) => {
				if (key in mocked.current) {
					mocked.current[key] = value;
				}
			});
			mockedObjects.delete(object);
		}
	},
	unmockAll() {
		mockedObjects.forEach((mocked) => {
			mocked.originalProps.forEach((value, key) => {
				if (key in mocked.current) {
					/* eslint-disable no-param-reassign */
					mocked.current[key] = value;
					/* eslint-enable no-param-reassign */
				}
			});
		});
		mockedObjects.clear();
	},
};

// @flow
const { mock } = ObjectMockHelper;
const { mockConstructor: mockDateConstructor, OriginalDate } = DateMockHelper;

function mockMethod(object, methodName, method) {
	const mockedFn = jest.fn(method);
	mock(object, methodName, mockedFn);
	return mockedFn;
}

function mockAsyncMethod(object, methodName, resolveValue) {
	const promise = Promise.resolve(resolveValue);
	return {
		promise,
		fn: mockMethod(object, methodName, () => promise),
	};
}

function mockAsyncMethodWithException(object, methodName, rejectValue) {
	const promise = Promise.reject(rejectValue);
	return {
		promise,
		fn: mockMethod(object, methodName, () => promise),
	};
}

function unmockAll() {
	ObjectMockHelper.unmockAll();
	DateMockHelper.unmock();
}

exports.mock = mock;
exports.mockDateConstructor = mockDateConstructor;
exports.OriginalDate = OriginalDate;
exports.mockMethod = mockMethod;
exports.mockAsyncMethod = mockAsyncMethod;
exports.mockAsyncMethodWithException = mockAsyncMethodWithException;
exports.unmockAll = unmockAll;

Object.defineProperty(exports, '__esModule', { value: true });

})));

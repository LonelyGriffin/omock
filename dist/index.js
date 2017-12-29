"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
var MOCKED_OBJECTS = new Map();
var CONFIG = {
	methodSpyCreator: function methodSpyCreator(methodResult) {
		return function () {
			return methodResult;
		};
	}

	// UTILS

};var createMockedObject = function createMockedObject(object) {
	return {
		originalProps: new Map(),
		current: object
	};
};

// BASE

var configureMock = exports.configureMock = function configureMock() {
	var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

	CONFIG.methodSpyCreator = config.methodSpyCreator || CONFIG.methodSpyCreator;
};

var mock = exports.mock = function mock(object, name, value) {
	if (name in object) {
		var mockedObject = MOCKED_OBJECTS.get(object) || createMockedObject(object);

		if (!mockedObject.originalProps.has(name)) {
			mockedObject.originalProps.set(name, mockedObject.current[name]);
		}

		mockedObject.current[name] = value;
		MOCKED_OBJECTS.set(object, mockedObject);
	} else {
		throw new Error("Object mock failed: object have no property " + name);
	}
};

var unmockAll = exports.unmockAll = function unmockAll() {
	MOCKED_OBJECTS.forEach(function (mockedObject) {
		mockedObject.originalProps.forEach(function (originalProp, propertyName) {
			if (propertyName in mockedObject.current) {
				mockedObject.current[propertyName] = originalProp;
			}
		});
	});
	MOCKED_OBJECTS.clear();
};

var getOriginal = exports.getOriginal = function getOriginal(object, name) {
	var mockedObject = MOCKED_OBJECTS.get(object);
	var originalProperty = mockedObject ? mockedObject.originalProps.get(name) : undefined;

	return originalProperty ? originalProperty : object[name];
};

// SUGAR

var mockMethod = exports.mockMethod = function mockMethod(object, name, value) {
	for (var _len = arguments.length, spyCreatorProps = Array(_len > 3 ? _len - 3 : 0), _key = 3; _key < _len; _key++) {
		spyCreatorProps[_key - 3] = arguments[_key];
	}

	var mockedMethod = CONFIG.methodSpyCreator.apply(CONFIG, [value].concat(spyCreatorProps));

	mock(object, name, mockedMethod);

	return mockedMethod;
};

var mockAsyncMethod = exports.mockAsyncMethod = function mockAsyncMethod(object, name, value) {
	for (var _len2 = arguments.length, spyCreatorProps = Array(_len2 > 3 ? _len2 - 3 : 0), _key2 = 3; _key2 < _len2; _key2++) {
		spyCreatorProps[_key2 - 3] = arguments[_key2];
	}

	var promise = Promise.resolve(value);
	var method = mockMethod.apply(undefined, [object, name, promise].concat(spyCreatorProps));

	return { method: method, promise: promise };
};

var mockAsyncMethodWithException = exports.mockAsyncMethodWithException = function mockAsyncMethodWithException(object, name, error) {
	for (var _len3 = arguments.length, spyCreatorProps = Array(_len3 > 3 ? _len3 - 3 : 0), _key3 = 3; _key3 < _len3; _key3++) {
		spyCreatorProps[_key3 - 3] = arguments[_key3];
	}

	var promise = Promise.reject(error);
	var method = mockMethod.apply(undefined, [object, name, promise].concat(spyCreatorProps));

	return { method: method, promise: promise };
};
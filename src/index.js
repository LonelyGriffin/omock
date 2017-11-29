import { resolve } from "url";

const MOCKED_OBJECTS = new Map();
const CONFIG = {
	global: window || global || this,
	methodSpyCreator: methodResult => () => methodResult,
}

// UTILS

const createMockedObject = (object) => ({
	originalProps: new Map(),
	current: object,
})

// BASE

export const configureMock = (config = {}) => {
	CONFIG.global = config.global || CONFIG.global;
	CONFIG.methodSpyCreator = config.methodSpyCreator || CONFIG.methodSpyCreator;
}

export const mock = (object, propertyName, newPropertyValue) => {
	if (propertyName in object) {
		const mockedObject = MOCKED_OBJECTS.get(object) || createMockedObject(object);

		if (!mockedObject.originalProps.has(propertyName)) {
			mockedObject.originalProps.set(propertyName, mockedObject.current[propertyName]);
		}

		mockedObject.current[propertyName] = propertyValue;
		MOCKED_OBJECTS.set(object, mockedObject);
	} else {
		throw new Error(`Object mock failed: object have no property ${propertyName}`);
	}
}

export const unmockAll = () => {
	MOCKED_OBJECTS.forEach((mockedObject) => {
		mockedObject.originalProps.forEach((originalProp, propertyName) => {
			if (propertyName in mockedObject.current) {
				mockedObject.current[propertyName] = originalProp;
			}
		});
	});
	MOCKED_OBJECTS.clear();
}

export const getOriginal = (object, propertyName) => {
	const mockedObject = MOCKED_OBJECTS.get(object);

	return mockedObject ? mockedObject.originalProps.get(propertyName) : undefined;
}

// SUGAR

export const mockMethod = (object, methodName, newMethodResult, ...spyCreatorProps) => {
	const mockedMethod = CONFIG.methodSpyCreator(newMethodResult, ...spyCreatorProps)
	
	mock(object, methodName, mockedMethod);
	
	return mockedMethod;
}

export const mockAsyncMethod = (object, methodName, resolveValue, ...spyCreatorProps) => {
	const promise = Promise.resolve(resolveValue);
	const method = mockMethod(object, methodName, promise, ...spyCreatorProps);

	return { method, promise };
}

export const mockAsyncMethodWithException = (object, methodName, rejectValue, ...spyCreatorProps) => {
	const promise = Promise.reject(rejectValue);
	const method = mockMethod(object, methodName, promise, ...spyCreatorProps);

	return { method, promise };
}

export const mockDateConstructor = (date) => {
	class MockedDate extends CONFIG.global.Date {
		constructor() {
			super();
			return date;
		}
	};

	mock(CONFIG.global, 'Date', MockedDate);
}
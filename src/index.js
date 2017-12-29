const MOCKED_OBJECTS = new Map();
const CONFIG = {
	methodSpyCreator: methodResult => () => methodResult,
}

// UTILS

const createMockedObject = (object) => ({
	originalProps: new Map(),
	current: object,
})

// BASE

export const configureMock = (config = {}) => {
	CONFIG.methodSpyCreator = config.methodSpyCreator || CONFIG.methodSpyCreator;
}

export const mock = (object, name, value) => {
	if (name in object) {
		const mockedObject = MOCKED_OBJECTS.get(object) || createMockedObject(object);

		if (!mockedObject.originalProps.has(name)) {
			mockedObject.originalProps.set(name, mockedObject.current[name]);
		}

		mockedObject.current[name] = value;
		MOCKED_OBJECTS.set(object, mockedObject);
	} else {
		throw new Error(`Object mock failed: object have no property ${name}`);
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

export const getOriginal = (object, name) => {
	const mockedObject = MOCKED_OBJECTS.get(object);
	const originalProperty = mockedObject ? mockedObject.originalProps.get(name) : undefined;

	return originalProperty ? originalProperty : object[name];
}

// SUGAR

export const mockMethod = (object, name, value, ...spyCreatorProps) => {
	const mockedMethod = CONFIG.methodSpyCreator(value, ...spyCreatorProps)
	
	mock(object, name, mockedMethod);
	
	return mockedMethod;
}

export const mockAsyncMethod = (object, name, value, ...spyCreatorProps) => {
	const promise = Promise.resolve(value);
	const method = mockMethod(object, name, promise, ...spyCreatorProps);

	return { method, promise };
}

export const mockAsyncMethodWithException = (object, name, error, ...spyCreatorProps) => {
	const promise = Promise.reject(error);
	const method = mockMethod(object, name, promise, ...spyCreatorProps);

	return { method, promise };
}

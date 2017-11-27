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

export default ObjectMockHelper;

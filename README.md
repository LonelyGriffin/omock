EN <a href="https://github.com/LonelyGriffin/omock/blob/master/README_RU.md">RU</a>

Omock is small set of methods for object property mocking. It is very conveniently for testing when you have dependence between modules<br/>

Why is it not jest \_\_mock\_\_ folder or analogue? Because mocking of export in separate folder is more 	
complex in supporting. And hang of it realization have to keep in mind right along.
Mocking directly in test case is more clear and readable.

*Note! Omock use es6 **Map**, your test environment should have it*<br/>
*Note! If you try mock no exist property then it will throw exception*

## Example:
```javascript
//foo.js
export default {
  ten: () => 10,
  deferredTen: new Promise(resolve => setTimeout(() => resolve(10), 100),
}

// bar.js
import Foo from 'foo.js';

export default {
  twenty: () => Foo.ten() * 2,
  deferredTwenty: () => Foo.deferredTen().then(ten => ten * 2),
}

// bar.test.js
import Bar from 'bar.js';
import Foo from 'foo.js';
import { mockMethod, unmockAll, configureMock } from 'omock';

configureMock({ methodSpyCreator: jest.fn })

describe('Bar', () => {
  afterEach(() => {
    unmockAll();
  });
  it('twenty() by mock', () => {
    mock(Foo, 'ten', () => 100);

    expect(Bar.twenty()).toBe(200);
  });
  it('twenty() by mockMethod', () => {
    const mockedTen = mockMethod(Foo, 'ten', 100);

    expect(Bar.twenty()).toBe(200);
    expect(mockedTen.mock.calls.length).toBe(1);
  });
    it('deferredTwenty()', () => {
    const { method, promise } = mockAsyncMethod(Foo, 'deferredTen', 100);

    Bar.deferredTwenty();

    return promise.then(result => {
      expect(result).toBe(200);
      expect(method.mock.calls.length).toBe(1);
    });
  });
  ...
})
```

## Api

* <a href="#configureMock">configureMock</a> - It is first configuration (optional).
* <a href="#mock">mock</a> - It is main method allowing substitute object property.
* <a href="#unmockAll">unmockAll</a> - It reset to original all substituted property in all objects.
* <a href="#getOriginal">getOriginal</a> - It return original value of object property.
* <a href="#mockMethod">mockMethod</a> - It is conveniently way for substitute of object method
* <a href="#mockAsyncMethod">mockAsyncMethod</a> - It is conveniently way for substitute of object method that return promise
* <a href="#mockAsyncMethodWithException">mockAsyncMethodWithException</a> - It is conveniently way for substitute of object method that return promise with specified exception

<a id="configureMock"></a>
### configureMock
It allow for mockMethod, mockAsyncMethod, mockAsyncMethodWithException methods set spy function like as jest.fn

Input:
* Object: {<br />
  &nbsp;&nbsp;&nbsp;&nbsp;methodSpyCreator: (method: Function, ...args: Array<any>) => SpiedFunction;<br />
}

methodSpyCreator - spy util for creating of mocked function like as jest.fn

Output: void

### mock
It allow substitute object property to specified value

Input:
* object: Object - target object
* name: string - name of property
* value: any - new value of property

Output: void

<a id="unmockAll"></a>
### unmockAll
It allow reset all substitutions.

Input: void

Output: void

<a id="getOriginal"></a>
### getOriginal
It return original value of object property.

Input:
* object: Object - target object
* name: string - name of property

<a id="mockMethod"></a>
### mockMethod
It allow substitute result of object method.

Input:
* object: Object - target object
* name: string - name of object method
* value: any - new result of object method

Output: substituting function, if spy creator is configured then function will wrapped by spy creator.

<a id="mockAsyncMethod"></a>
### mockAsyncMethod
It allow substitute promise result of object async method.

Input:
* object: Object - target object
* name: string - name of object async method
* value: any - new promise result of object method

Output: Object: {<br />
  &nbsp;&nbsp;&nbsp;&nbsp;method - substituting function, if spy creator is configured then function will wrapped by spy creator.<br />
  &nbsp;&nbsp;&nbsp;&nbsp;promise - returning promise by method<br />
}

<a id="mockAsyncMethodWithException"></a>
### mockAsyncMethodWithException
It allow substitute promise result of object async method as rejected.

Input:
* object: Object - target object
* name: string - name of object async method
* error: any - value of exception

Output: Object: {<br />
  &nbsp;&nbsp;&nbsp;&nbsp;method - substituting function, if spy creator is configured then function will wrapped by spy creator.<br />
  &nbsp;&nbsp;&nbsp;&nbsp;promise -  returning rejected promise by method<br />
}

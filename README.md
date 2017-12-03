*Note! OMock use es6 **Map** so you must have suitable environment*

OMock is simple tool for mocking js object structurals. Its powerful for modules because any es6 js export is singleton object <br/>
Take look at the example:

```javascript
//foo.js
export default {
  ten: () => 10,
}

// bar.js
import Foo from 'foo.js'

export default {
  twenty: () => Foo.ten() * 2,
}

// bar.test.js
import Bar from 'bar.js'
import Foo from 'foo.js'
import { mock } from 'omock'

describe('Bar', () => {
  it('should use Foo', () => {
    const ten = () => 100;

    mock(Foo, 'ten', ten);

    expect(Bar.twenty()).toBe(200);
  })
})
```

## Api

| Method | Options | Return | Description |
|:---|:--------|:---|:---|
| configureMock | configureObject: {<br/>&nbsp;&nbsp;&nbsp;global,<br/>&nbsp;&nbsp;&nbsp;methodSpyCreator<br/>}| void | Configuration of OMock<br/> - global - overwrite using global object like as window<br/>window, global or this by default<br/> - methodSpyCreator - method like as jest.fn()<br/> Clear function by default |
| mock | - object: Object<br/> - name: string<br/> - value: T | void | Base mocking method.<br/>It is simple replacement of property value<br/> - object - mocking object<br/> - name - name of mocking property<br/> - value - substituting value |
| unmockAll | void | void | Return all mocked objects to the original state |
| getOriginal |  - object: Object<br/> - name: string | T | Return original value of mocked property.<br/>If property or object was not mocked then<br/> return value from passed object <br/> - object - mocking object<br/> - name - name of mocking property |
| mockMethod | - object: Object<br/> - name: string<br/> - value: T<br/> - ...spyCreatorProps?: Array&lt;any&gt; | Function | sugar for method mocking via its result<br/> - object - mocking object<br/> - name - name of mocking property<br/> - value - substituting value of method result<br/> - spyCreatorProps - additional properties for <br/> methodSpyCreator, optional<br/> return substituting method created by methodSpyCreator |
| mockAsyncMethod | - object: Object<br/> - name: string<br/> - value: T<br/> - ...spyCreatorProps?: Array&lt;any&gt; | {<br/>&nbsp;&nbsp;&nbsp;fn: Function,<br/>&nbsp;&nbsp;&nbsp;promise: Promise&lt;T&gt;<br/>} | sugar for mocking of promise method via its result<br/> - object - mocking object<br/> - name - name of mocking property<br/> - value - substituting value for promise resolve<br/> - spyCreatorProps - additional properties for <br/> methodSpyCreator, optional<br/> return substituting promise and method created by methodSpyCreator |
| mockAsyncMethodWithException | - object: Object<br/> - name: string<br/> - error: E<br/> - ...spyCreatorProps?: Array&lt;any&gt; | {<br/>&nbsp;&nbsp;&nbsp;fn: Function,<br/>&nbsp;&nbsp;&nbsp;promise: Promise&lt;T&gt;<br/>} | sugar for mocking of promise method with exception via its error<br/> - object - mocking object<br/> - name - name of mocking property<br/> - error - substituting error for promise reject<br/> - spyCreatorProps - additional properties for <br/> methodSpyCreator, optional<br/> return substituting promise and method created by methodSpyCreator |
| mockDateConstructor | - date: Date | void | sugar for mocking of date constructor<br/> - date - date always creating after mock |
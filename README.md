OMock its simple tool for mocking js object structurals. Its powerful for modules because any es6 js export is singleton object <br/>
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
WiP

- configureMock(config = {})
- mock(object, propertyName, newPropertyValue)
- unmockAll()
- getOriginal(object, propertyName)
- mockMethod(object, methodName, newMethodResult, ...spyCreatorProps?)
- mockAsyncMethod(object, methodName, resolveValue, ...spyCreatorProps?)
- mockAsyncMethodWithException(object, methodName, rejectValue, ...spyCreatorProps?)
- mockDateConstructor(date)

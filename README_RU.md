<a href="https://github.com/LonelyGriffin/omock/blob/master/README.md">EN</a> RU

Omock это небольшой набор методов для создания фиктивных свойств в объекте (mocking), Это черезвычайно удобно при тестировании сущностей с зависимостями в виде других модулей <br/>

Почему не jest.mock с его \_\_mock\_\_ папкой или аналог? Потому что mocking экспорта в отдельном файле труднее в поддержке. А также, особенности его реализации приходится постоянно держать в уме.
Mocking непосредственно в тестовом кейсе является более прозрачным и читабельным. Особено при использовании

*Обратите внимание! Omock использует **Map** из es6, ваше тестовое окружение должно поддерживать его*<br/>
*Обратите внимание! При попытке подменить свойство отсутствующие в объекте будет выброшена ошибка*

## Пример:
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

* <a href="#configureMock">configureMock</a> - Начальная настройка (опционально)
* <a href="#mock">mock</a> - основной метод, позволяет 'подменить' свойство объекта
* <a href="#unmockAll">unmockAll</a> - восстанавливает все измененные библиотекой объекты в первоначальное состояние.
* <a href="#getOriginal">getOriginal</a> - возвращает оригинальное значение свойства
* <a href="#mockMethod">mockMethod</a> - удобный способ подмены методов в объекте
* <a href="#mockAsyncMethod">mockAsyncMethod</a> - удобный способ подмены методов в объекте, которые возвращают promise. С заменой на метод возвращающий resolved promise с заданным значением
* <a href="#mockAsyncMethodWithException">mockAsyncMethodWithException</a> - удобный способ подмены методов в объекте, которые возвращают promise. С заменой на метод возвращающий rejected promise с заданной ошибкой

<a id="configureMock"></a>
### configureMock
Позволяет для методов mockMethod, mockAsyncMethod, mockAsyncMethodWithException задать spy функцию наподобие jest.fn, Достаточно сконфигурировать один раз.

Входные параметры:
* Object: {<br />
  &nbsp;&nbsp;&nbsp;&nbsp;methodSpyCreator: (method: Function, ...args: Array<any>) => SpiedFunction;<br />
}

methodSpyCreator - spy утилита для создания mocked функций на подобие jest.fn

Возвращаемое значение: void

### mock
Позволяет подменить значение свойства в объекте на заданное

Входные параметры:
* object: Object - Целевой объект
* name: string - Имя подменяемого свойства
* value: any - Новое значение свойства

Возвращаемое значение: void

<a id="unmockAll"></a>
### unmockAll
Позволяет сбросить все подмены совершенные до этого. Восстанавливая первоначальное состояние объектов

Входные параметры отсутствуют

Возвращаемое значение: void

<a id="getOriginal"></a>
### getOriginal
Возвращает оригинальное значения свойства объекта.

Входные параметры:
* object: Object - Целевой объект
* name: string - Имя подмененного свойства

<a id="mockMethod"></a>
### mockMethod
Позволяет подменить возвращаемое значение метода в объекте

Входные параметры:
* object: Object - Целевой объект
* name: string - Имя подменяемого метода
* value: any - Новое возвращаемое значение метода

Возвращаемое значение: подменяющая функция, если сконфигурирован spy creator то она будет им обернута.

<a id="mockAsyncMethod"></a>
### mockAsyncMethod
Позволяет подменить возвращаемое значение promise метода в объекте

Входные параметры:
* object: Object - Целевой объект
* name: string - Имя подменяемого метода
* value: any - Новое возвращаемое значение в promise

Возвращаемое значение: Object: {<br />
  &nbsp;&nbsp;&nbsp;&nbsp;method - подменяющая функция, если сконфигурирован spy creator то она будет им обернута.<br />
  &nbsp;&nbsp;&nbsp;&nbsp;promise - возвращаемый методом promise<br />
}

<a id="mockAsyncMethodWithException"></a>
### mockAsyncMethodWithException
Позволяет подменить возвращаемое значение promise метода в объекте с исключением

Входные параметры:
* object: Object - Целевой объект
* name: string - Имя подменяемого метода
* error: any - Значение выбрасываемой ошибки

Возвращаемое значение: Object: {<br />
  &nbsp;&nbsp;&nbsp;&nbsp;method - подменяющая функция, если сконфигурирован spy creator то она будет им обернута.<br />
  &nbsp;&nbsp;&nbsp;&nbsp;promise - возвращаемый методом promise с ошибкой<br />
}

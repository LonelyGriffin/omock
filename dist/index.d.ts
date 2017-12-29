export declare function configureMock(config: {
  methodSpyCreator?: (method: Function, ...props: Array<any>) => any;
}): void;

interface mockedMethod<V> {
  (...props: Array<any>): V;
  [key: string]: any;
}

export declare function mock<O extends Object>(
  object: O,
  name: keyof O,
  value: any
): void;

export declare function unmockAll(): void;

export declare function getOriginal<O, N extends keyof O>(
  object: O,
  name: N,
): O[N];

export declare function mockMethod<O, N extends keyof O, V>(
  object: O,
  name: N,
  value: V,
  spyCreatorProps?: Array<any>
): mockedMethod<V>;

export declare function mockAsyncMethod<O, N extends keyof O, V>(
  object: O,
  name: N,
  value: V,
  spyCreatorProps?: Array<any>
): {
  promise: Promise<V>;
  method: mockedMethod<Promise<V>>;
};

export declare function mockAsyncMethodWithException<O, N extends keyof O, E>(
  object: O,
  name: N,
  value: E,
  spyCreatorProps?: Array<any>
): {
  promise: Promise<void>;
  method: mockedMethod<Promise<void>>
};
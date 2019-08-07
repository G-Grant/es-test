> 下文仅针对 @observable 使用方式说明。

```js
@observable name = '张三';
```

当调用 observable 方法，其实就是在调用 createObservable 方法。

```js
var observable = createObservable;
```

createObservable 方法接收 3 个参数 v, arg2, arg3。这三个参数来源为 _applyDecoratedDescriptor，此方法会接收 target, property, decorators, descriptor, context。

```js
// _applyDecoratedDescriptor 部分代码
desc = decorators.slice().reverse().reduce(function(desc, decorator) {
    return decorator(target, property, desc) || desc;
}, desc);
```

- `v`: target，如果是绑定在类中属性上，target 为类的原型对象
- `arg2`: property，属性
- `arg3`: desc，属性描述符

createObservable 首先会判断 arg2 参数是否为 string，如果是则调用 deepDecorator 方法，并把参数传入进去。

```js
function createObservable(v, arg2, arg3) {
    if (typeof arguments[1] === "string") {
        return deepDecorator.apply(null, arguments);
    }
    ...
}
```

调用 deepDecorator 实际上就是在调用 createDecoratorForEnhancer(deepEnhancer) 返回的函数。

```js
var deepDecorator = createDecoratorForEnhancer(deepEnhancer);
```

createDecoratorForEnhancer 方法内部会调用 createPropDecorator 获取到 decorator，并把得到的 decorator 给返回出去，并在 decorator 上绑定 enhancer，这个 enhancer 就是 deepEnhancer。

```js
function createDecoratorForEnhancer(enhancer) {}
```

这里的 deepEnhancer 会对传入的参数进行判断，判断后会针对类型调用不同的方法。

```js
function deepEnhancer(v, _, name) {
    // 如果已经是 observable，直接 return
    if (isObservable(v))
        return v;
    // 如果是其他类型值，则用对应的 observable 再包装。
    if (Array.isArray(v))
        return observable.array(v, { name: name });
    if (isPlainObject(v))
        return observable.object(v, undefined, { name: name });
    if (isES6Map(v))
        return observable.map(v, { name: name });
    if (isES6Set(v))
        return observable.set(v, { name: name });
    return v;
}
```

前面我们说到，observable 实际上调用的是 createPropDecorator 返回的 decorator，createPropDecorator 内部会对我们传入的 arguments 进行判断，如果是 @decorator 写法，则先判断 target 是否存在 __mobxDecorators，如果不存在，则调用 addHiddenProp 在 target 上添加此属性，然后赋值。最后会返回 createPropertyInitializerDescriptor 调用结果，createPropertyInitializerDescriptor 方法主要判断当前属性是否可枚举，如果是，则在可枚举缓存描述对象内加入此属性，否则，则在不可枚举缓存对象描述上加。

```js
// addHiddenProp 方法片段
Object.defineProperty(object, propName, {
    enumerable: false,
    writable: true,
    configurable: true,
    value: value
});

// createPropDecorator 方法片段
target.__mobxDecorators[prop] = {
    prop: prop,
    propertyCreator: propertyCreator,
    descriptor: descriptor,
    decoratorTarget: target,
    decoratorArguments: decoratorArguments
};
```

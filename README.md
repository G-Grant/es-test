当调用 observable 方法，其实就是在调用 createObservable 方法。

```js
var observable = createObservable;
```

该方法接收 3 个参数 v, arg2, arg3。这三个参数来源为 _applyDecoratedDescriptor，此方法会接收 target, property, decorators, descriptor, context。

- `v`: target，如果是绑定在类中属性上，target 为类的原型对象
- `arg2`: property，属性
- `arg3`: desc，属性描述符

```js
// _applyDecoratedDescriptor 部分代码
desc = decorators.slice().reverse().reduce(function(desc, decorator) {
    return decorator(target, property, desc) || desc;
}, desc);
```

createObservable 首先会判断 arg2 参数是否为 string，如果是则调用 deepDecorator.apply(null, arguments)。
deepDecorator 方法其实就是 createDecoratorForEnhancer(deepEnhancer) 方法。

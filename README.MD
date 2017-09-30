# PARAM 参数管理

  [![NPM Version][npm-image]][npm-url]

## 基本用法

这是一个存放获取数据的容器

```javascript
const Param = require('v-param');

let param = new Param({
    foo: 'bar',
});
console.log(param.get('foo')); // 'bar'
console.log(param.get('a.b')); // null

param.append({
    a: { b: 1 },
});
console.log(param.get('a.b')); // 1
```

## 抓取错误信息 (promise)

为了错误信息更加清晰，我们使用了 promise 来处理错误

```javascript
const Param = require('v-param');

let param = new Param({
    foo: 'bar',
});

param.append('').catch((error) => {
    console.log(error); // somethings
});

param.setSchema({
    properties: {
        foo: { type: 'string', },
        bar: { type: 'string', }
    },
    required: [ 'foo', 'bar' ],
}).catch((error) => {
    console.log(error); // somethings
});

param.set('foo', {}).catch((error) => {
    console.log(error); // somethings
});

param.delete('foo').catch((error) => {
    console.log(error); // somethings
});

```
**get 接口直接返回数据**

## schema

使用了 jsen 来校验数据正确性

```javascript
const Param = require('v-param');

let param = new Param({
    foo: 'bar',
});

param.setSchema({
    'properties': {
        foo: {
            type: 'string',
        },
    },
    required: [ 'foo' ],
}, {
    version: 'draft-06',
});

param.delete('foo'); // print warn info
console.log(param.get('foo')); // 'bar'
```

## default

可以给 param 设置一个默认值，在找不到数据的时候将会使用默认数据

```javascript
const Param = require('v-param');

let param = new Param({
    foo: 'bar',
});

param.setDefault({
    foo2: 'bar2'
});

console.log(param.get('foo2')); // 'bar2'
```
## License

  [MIT](LICENSE)

[npm-image]: https://img.shields.io/npm/v/v-param.svg
[npm-url]: https://npmjs.org/package/v-param
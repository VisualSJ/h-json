# PARAM 参数管理

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

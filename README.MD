# PARAM 参数管理

参数管理器

```
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




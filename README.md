# Inline

Replaces link tags with inline style tags.

## Install

```
npm i inline-io -g
```

## Use

### As standalone

```
Usage: inline-io <file>
```

### As module

```
npm i instal-io
```

```js
var inline  = require('inline-io'),
    path    = require('path'),
    name    = 'test/index.html',
    dir     = path.dirname(name);

fs.readFile(name, function(error, data) {
    if (error)
        console.log(error);
    else
        inline(data, dir, function(error, result) {
            console.log(error || result);
        });
});
```

## License

MIT

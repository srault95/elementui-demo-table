# elementui-demo-table

> A Vue.js component module

# Usage

## ES6 Modules / CommonJS

```bash
$ npm run build
```

```js
import ElementuiDemoTable from 'dist/elementui-demo-table';

Vue.component('elementui-demo-table', ElementuiDemoTable);
```

```html
<elementui-demo-table text="Hello World!"></elementui-demo-table>
```

## UMD

```bash
$ npm run build:umd
```

```html
<elementui-demo-table text="Hello World!"></elementui-demo-table>

<script src="https://unpkg.com/vue" charset="utf-8"></script>
<script src="./dist/elementui-demo-table.min.js" charset="utf-8"></script>

<script type="text/javascript">
  Vue.component('elementui-demo-table', window.ElementuiDemoTable);
</script>
```

## Installation

### Using yarn

`yarn add elementui-demo-table`

### Using npm

`npm i --save elementui-demo-table`

## Demo and Docs

`npm run serve`

## Tests

This template uses karma with chai by default, you can change test settings in poi.config.js

`npm run test`
`npm run test:watch`
`npm run test:cov`

## License

This project is licensed under [MIT License](http://en.wikipedia.org/wiki/MIT_License)

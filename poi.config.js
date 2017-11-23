const path = require('path')
const presetKarma = require('poi-preset-karma');
const webpack = require('webpack');
const glob = require('glob').sync;
const {name} = require('./package.json');
const pkg = require('./package')

/*
poi build example/index.js --templateCompiler --format umd --no-sourceMap --filename example
> créé un dist/client.js ???
*/
module.exports = {
  // entry: glob('./src/**/*.vue'),
  entry: {
    'elementui-demo-table': './src/elementui-demo-table/elementui-demo-table.vue',
    'example': 'example/index.js'
  },
  /*
  filename: {
    js: name + '.min.js',
    css: name + '.min.css'
  },
  */
  sourceMap: true,
  // html: false,
  html: {
    title: pkg.productName,
    description: pkg.description,
    template: path.join(__dirname, 'index.ejs')
  },
  presets: [
    presetKarma({
      files: ['./test/specs/**.spec.js'],
      browsers: ['PhantomJS'],
      frameworks: ['mocha', 'chai', 'phantomjs-shim'],
    })
  ],
  moduleName: 'ElementuiDemoTable'
};

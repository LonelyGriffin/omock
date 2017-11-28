const rollup = require('rollup');

async function build() {
  // create a bundle
  const bundle = await rollup.rollup({
    input: 'src/index.js'
  });

  await bundle.write({
    file: 'dist/index.js',
    format: 'umd' ,
    name: 'OMock',
    sourcemap: false,
  });
}

build();
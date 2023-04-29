module.exports = [{
  mode: 'production',
  entry: { 
    d2s: './src/index.ts',
    vanilla_constants_96: './src/data/versions/vanilla/96_constant_data.ts',
    vanilla_constants_99: './src/data/versions/vanilla/99_constant_data.ts',
    remodded_constants_96: './src/data/versions/remodded/96_constant_data.ts',
    remodded_constants_99: './src/data/versions/remodded/99_constant_data.ts'
  },
  plugins: [],
  output: {
    path: __dirname + '/dist',
    filename: '[name].bundle.min.js',
    library: '[name]'
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js']
  },
  module: {
    rules: [
      { test: /\.tsx?$/, loader: 'ts-loader' }
    ]
  }
},
{
  mode: 'development',
  entry: { 
    d2s: './src/index.ts',
    vanilla_constants_96: './src/data/versions/vanilla/96_constant_data.ts',
    vanilla_constants_99: './src/data/versions/vanilla/99_constant_data.ts',
    remodded_constants_96: './src/data/versions/remodded/96_constant_data.ts',
    remodded_constants_99: './src/data/versions/remodded/99_constant_data.ts'
  },
  devtool: 'source-map',
  plugins: [],
  output: {
    path: __dirname + '/dist',
    filename: '[name].bundle.js',
    library: '[name]'
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js']
  },
  module: {
    rules: [
      { test: /\.tsx?$/, loader: 'ts-loader' }
    ]
  }
}]
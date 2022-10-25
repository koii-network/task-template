const path = require('path');
const webpack = require('webpack'); //to access built-in plugins

module.exports = {
  entry: './src/index.ts',
  target: 'node',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  devtool: 'inline-source-map',
  stats: {
    moduleTrace: false,
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.FLUENTFFMPEG_COV': false,
    }),
  ],
};

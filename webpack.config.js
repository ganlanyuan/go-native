const path = require('path');
const webpack = require('webpack');
// const ExtractTextPlugin = require('extract-text-webpack-plugin');

const PATHS = {
  src: path.join(__dirname, 'src'),
  dist: path.join(__dirname, 'dist')
};

module.exports = {
  devtool: 'source-map',
  entry: ['./src/go-native.js'],
  output: {
    path: PATHS.dist,
    filename: 'go-native.js'
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        include: path.join(__dirname, 'src'),
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015']
        }
      }
    ]
  },

  // postcss: [
  //   require('autoprefixer')
  // ],

  plugins: [
    new webpack.optimize.OccurrenceOrderPlugin(),
    // new webpack.optimize.UglifyJsPlugin(),
    // new ExtractTextPlugin({
    //   filename: '/css/[name].css',
    //   allChunks: true,
    //   })
  ]
};
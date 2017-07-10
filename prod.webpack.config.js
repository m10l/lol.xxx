const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const data = require('./src/data.js');

module.exports = {
  entry: {
    main: './src/main.js'
  },
  output: {
    path: path.resolve('dist'),
    publicPath: '',
    filename: '[name].bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.hbs$/,
        loader: 'handlebars-loader'
      },
      {
        test: /\.js?$/,
        use: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.scss?$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: ['css-loader', 'sass-loader']
        })
      }
    ]
  },
  devServer: {
    compress: true,
    port: 9000,
    stats: 'errors-only',
    hot: true,
    open: true
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: '!!handlebars-loader!src/index.hbs',
      filename: 'index.html',
      title: 'Front End Developer & UX Designer in Berlin | Mike Mitchell',
      inject: 'body',
      hash: true,
      chunks: ['main'],
      data
    }),
    new ExtractTextPlugin({
      filename: 'main.css'
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin()
  ]
}

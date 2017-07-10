const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const data = require('./src/data.js');

module.exports = {
  entry: {
    main: './src/main.js'
  },
  output: {
    path: path.resolve('dist'),
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
        use: ['style-loader', 'css-loader', 'sass-loader']
      }
    ]
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
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin()
  ]
}

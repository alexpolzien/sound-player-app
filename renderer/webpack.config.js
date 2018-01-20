const path = require('path');
const webpack = require('webpack');

module.exports = {
  entry: {
    renderer: './src/renderer.jsx'
  },
  output: {
    publicPath: 'http://localhost:8080/'
  },
  devServer: {
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    hot: true
  },
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          {loader: 'style-loader'},
          {
            loader: 'css-loader',
            options: {
              modules: true,
              localIdentName: '[path][name]__[local]--[hash:base64:5]'
            }
          }
        ]
      },
      {
        test: /\.jsx?$/,
        exclude: /(node_modules)/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: ['react'],
              plugins: [
                'transform-object-rest-spread',
                'transform-class-properties',
                'react-hot-loader/babel'
              ]
            }
          }
        ]
      },
      {
        test: /\.coffee$/,
        use: ['coffee-loader']
      },
      {
        test: /\.worker\.js$/,
        use: {loader: 'worker-loader'}
      }
    ]
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin()
  ],
  target: 'electron-renderer'
};

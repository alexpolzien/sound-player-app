const path = require('path');
const webpack = require('webpack');

module.exports = {
  entry: {
    renderer: './src/js/renderer.jsx'
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
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.jsx?$/,
        exclude: /(node_modules)/,
        use: [
          {loader: 'react-hot-loader/webpack'},
          {
            loader: 'babel-loader',
            options: {
              presets: ['react']
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin()
  ]
};
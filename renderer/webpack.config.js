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
              plugins: ['react-hot-loader/babel']
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin()
  ],
  target: 'electron-renderer'
};

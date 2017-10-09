const path = require('path');

module.exports = {
  entry: {
    temp_db: './src/temp-db.js'
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist')
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: ['babel-loader']
      },
      {
        test: /\.coffee$/,
        use: ['coffee-loader']
      }
    ]
  },
  target: 'node'
};

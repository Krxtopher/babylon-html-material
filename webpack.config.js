// const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  mode: 'development',
  devtool: 'source-map',
  plugins: [
    new HtmlWebpackPlugin(),
    new CopyPlugin({
      patterns: [
        { from: '*.css', context: 'src/' },
        { from: '*.html', context: 'src/' },
        { from: 'assets/**/*.*', context: 'src/' },
      ],
    }),
  ],
  entry: './src/index.ts',
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        exclude: /node_modules/,
      },
      // If you'd like .css and image files to be compiled into the
      // application uncomment the lines below and use import statements
      // in your JavaScript to refer to these type assets.
      // {
      //   test: /\.css$/i,
      //   use: ['style-loader', 'css-loader'],
      // },
      // {
      //   test: /\.(png|svg|jpg|jpeg|gif)$/i,
      //   type: 'asset/resource',
      // },
    ],
  },
  output: {
    clean: true,
  },
  devServer: {
    static: './dist',
    liveReload: true,
    // Disabling hot reload ensures that changes to non-compiled files
    // like .html and .css are reflected in the browser.
    hot: false,
    open: '/',
    watchFiles: {
      paths: ['*.html', '*.css'],
    },
  },
};

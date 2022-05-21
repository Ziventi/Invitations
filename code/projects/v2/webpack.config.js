const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

/** @type {import('webpack').Configuration[]} */
module.exports = [createConfig('victory')];

function createConfig(name) {
  const cwd = path.resolve(__dirname);
  return {
    name: 'victory',
    devtool: 'inline-source-map',
    entry: './projects/victory/index.tsx',
    mode: 'development',
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
          },
        },
        {
          test: /\.(png|svg|jpg|jpeg|gif)$/i,
          type: 'asset/resource',
        },
      ],
    },
    output: {
      clean: true,
      filename: 'bundle.js',
      path: `${cwd}/projects/${name}dist`,
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: `${cwd}/index.html`,
      }),
    ],
    resolve: {
      extensions: ['.tsx', '.ts', '.js'],
    },
    /** @type {import('webpack-dev-server').Configuration} */
    devServer: {
      compress: true,
      historyApiFallback: true,
      open: false,
      port: 8080,
    },
  };
}

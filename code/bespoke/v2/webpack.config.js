const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

/** @type {import('webpack').Configuration[]} */
module.exports = [createConfig('victory')];

/**
 * Creates a new Webpack configuration.
 * @param {string} name The configuration name.
 * @returns {import('webpack').Configuration}
 */
function createConfig(name) {
  const cwd = path.resolve(__dirname);
  return {
    name,
    devtool: 'inline-source-map',
    entry: `./projects/${name}/index.tsx`,
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
      path: `${cwd}/projects/${name}/dist`,
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: `${cwd}/projects/${name}/index.html`,
      }),
    ],
    resolve: {
      extensions: ['.js', '.ts', '.tsx'],
    },
    /** @type {import('webpack-dev-server').Configuration} */
    devServer: {
      compress: true,
      historyApiFallback: true,
      open: false,
      port: 8080,
      static: {
        directory: `${cwd}/projects/${name}/config`,
      },
    },
  };
}

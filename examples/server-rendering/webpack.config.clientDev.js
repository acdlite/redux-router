import {
  HotModuleReplacementPlugin,
  NoErrorsPlugin
} from 'webpack';

import baseConfig from '../webpack.config.base';
import mergeConfig from '../mergeConfig';
import path from 'path';

const clientDevConfig = mergeConfig(baseConfig, {
  entry: [
    'webpack-hot-middleware/client',
    './client'
  ],
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'bundle.js',
    publicPath: '/static/'
  },
  plugins: [
    new HotModuleReplacementPlugin(),
    new NoErrorsPlugin()
  ],
  devtool: 'eval'
});

export default clientDevConfig;

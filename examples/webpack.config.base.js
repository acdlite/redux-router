import path from 'path';

const PROJECT_SRC = path.resolve(__dirname, '../src');

export default {
  module: {
    loaders: [{
      test: /\.js$/,
      loaders: ['babel'],
      exclude: path.resolve(__dirname, 'node_modules'),
      include: [
        path.resolve(__dirname),
        PROJECT_SRC
      ]
    }]
  },
  resolve: {
    alias: {
      'redux-react-router': PROJECT_SRC
    },
    extensions: ['', '.js']
  }
};

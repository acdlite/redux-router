import express from 'express';
import webpack from 'webpack';
import React from 'react';
import {renderToString} from 'react-dom/server';
import {Provider} from 'react-redux';
import {createStore} from 'redux';
import {ReduxRouter} from '../../src'; // 'redux-router'
import {reduxReactRouter, match} from '../../src/server'; // 'redux-router/server';
import qs from 'query-string';
import serialize from 'serialize-javascript';
import { createMemoryHistory } from 'history';

import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';

import config from './webpack.config.clientDev';
import {MOUNT_ID} from './constants';
import reducer from './reducer';
import routes from './routes';

const app = express();
const compiler = webpack(config);

const getMarkup = (store) => {
  const initialState = serialize(store.getState());

  const markup = renderToString(
    <Provider store={store} key="provider">
      <ReduxRouter/>
    </Provider>
  );

  return `<!doctype html>
    <html>
      <head>
        <title>Redux React Router – Server rendering Example</title>
      </head>
      <body>
        <div id="${MOUNT_ID}">${markup}</div>
        <script>window.__initialState = ${initialState};</script>
        <script src="/static/bundle.js"></script>
      </body>
    </html>
  `;
};

app.use(webpackDevMiddleware(compiler, {
  noInfo: true,
  publicPath: config.output.publicPath
}));

app.use(webpackHotMiddleware(compiler));

app.use((req, res) => {
  const store = reduxReactRouter({ routes, createHistory: createMemoryHistory })(createStore)(reducer);
  const query = qs.stringify(req.query);
  const url = req.path + (query.length ? '?' + query : '');

  store.dispatch(match(url, (error, redirectLocation, routerState) => {
    if (redirectLocation) {
      res.redirect(redirectLocation.pathname + redirectLocation.search);
    } else if (error) {
      console.error('Router error:', error);
      res.status(500);
      res.send(error);
    } else if (!routerState) {
      res.status(500);
    } else {
      res.send(getMarkup(store));
    }
  }));
});

app.listen(3000, 'localhost', error => {
  if (error) {
    console.log(error);
    return;
  }

  console.log('Listening at http://localhost:3000');
});

import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { RoutingContext } from 'react-router';
import routerStateEquals from './routerStateEquals';
import { ROUTER_STATE_SELECTOR } from './constants';

function memoizeRouterStateSelector(selector) {
  let previousRouterState = null;

  return state => {
    const nextRouterState = selector(state);
    if (routerStateEquals(previousRouterState, nextRouterState)) {
      return previousRouterState;
    }
    previousRouterState = nextRouterState;
    return nextRouterState;
  };
}

class ReduxRouter extends Component {
  static contextTypes = {
    store: PropTypes.object
  }

  render() {
    const { store } = this.context;

    if (!store) {
      throw new Error(
        'Redux store missing from context of <ReduxRouter>. Make sure you\'re '
      + 'using a <Provider>'
      );
    }

    const {
      history,
      [ROUTER_STATE_SELECTOR]: routerStateSelector
    } = store;

    if (!history || !routerStateSelector) {
      throw new Error(
        'Redux store not configured properly for <ReduxRouter>. Make sure '
      + 'you\'re using the reduxReactRouter() store enhancer.'
    );
    }

    return (
      <ReduxRouterContext
        history={history}
        routerStateSelector={memoizeRouterStateSelector(routerStateSelector)}
        {...this.props}
      />
    );
  }
}

@connect(
  (state, { routerStateSelector }) => routerStateSelector(state) || {}
)
class ReduxRouterContext extends Component {
  render() {
    return <RoutingContext {...this.props} />;
  }
}

export default ReduxRouter;

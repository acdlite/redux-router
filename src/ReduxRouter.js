import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { RoutingContext as DefaultRoutingContext } from 'react-router';
import routerStateEquals from './routerStateEquals';
import { ROUTER_STATE_SELECTOR } from './constants';
import { initRoutes, replaceRoutes } from './actionCreators';

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

function getRoutesFromProps(props) {
  return props.routes || props.children;
}

class ReduxRouter extends Component {
  static propTypes = {
    children: PropTypes.node
  }

  static contextTypes = {
    store: PropTypes.object
  }

  constructor(props, context) {
    super(props, context);
    context.store.dispatch(initRoutes(getRoutesFromProps(props)));
  }

  componentWillReceiveProps(nextProps) {
    this.receiveRoutes(getRoutesFromProps(nextProps));
  }

  receiveRoutes(routes) {
    if (!routes) return;

    const { store } = this.context;
    store.dispatch(replaceRoutes(routes));
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
    const RoutingContext = this.props.RoutingContext || DefaultRoutingContext;

    return <RoutingContext {...this.props} />;
  }
}

export default ReduxRouter;

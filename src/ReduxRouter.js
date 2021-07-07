import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect, useStore } from "react-redux";
import { RouterContext as DefaultRoutingContext } from "@sigfox/react-router";
import { createRouterObject } from "@sigfox/react-router/lib/RouterUtils";
import routerStateEquals from "./routerStateEquals";
import { ROUTER_STATE_SELECTOR } from "./constants";
import { initRoutes, replaceRoutes } from "./actionCreators";

function memoizeRouterStateSelector(selector) {
  let previousRouterState = null;

  return (state) => {
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

function withStore(ClassComponent) {
  return function WrappedComponent(props) {
    const store = useStore();
    return <ClassComponent {...props} store={store} />;
  };
}

class ReduxRouter extends Component {
  static propTypes = {
    children: PropTypes.node,
  };

  constructor(props, context) {
    super(props, context);
    this.router = createRouterObject(
      this.props.store.history,
      this.props.store.transitionManager
    );
  }

  UNSAFE_componentWillMount() {
    this.props.store.dispatch(initRoutes(getRoutesFromProps(this.props)));
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    this.receiveRoutes(getRoutesFromProps(nextProps));
  }

  receiveRoutes(routes) {
    if (!routes) return;

    this.props.store.dispatch(replaceRoutes(routes));
  }

  render() {
    if (!this.props.store) {
      throw new Error(
        "Redux store missing from context of <ReduxRouter>. Make sure you're " +
          "using a <Provider>"
      );
    }

    const { history, [ROUTER_STATE_SELECTOR]: routerStateSelector } =
      this.props.store;

    if (!history || !routerStateSelector) {
      throw new Error(
        "Redux store not configured properly for <ReduxRouter>. Make sure " +
          "you're using the reduxReactRouter() store enhancer."
      );
    }

    return (
      <ReduxRouterContext
        history={history}
        routerStateSelector={memoizeRouterStateSelector(routerStateSelector)}
        router={this.router}
        {...this.props}
      />
    );
  }
}

@connect((state, { routerStateSelector }) => routerStateSelector(state) || {})
class ReduxRouterContext extends Component {
  static propTypes = {
    location: PropTypes.object,
    RoutingContext: PropTypes.func,
  };

  render() {
    const { location } = this.props;

    if (location === null || location === undefined) {
      return null; // Async matching
    }

    const RoutingContext = this.props.RoutingContext || DefaultRoutingContext;

    return <RoutingContext {...this.props} />;
  }
}

export default withStore(ReduxRouter);

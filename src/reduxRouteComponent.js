import { Component, PropTypes } from 'react';
import { TRANSITION_TO, REPLACE_WITH } from './actionTypes';
import locationDidChange from './locationDidChange';
import locationStateEquals from './locationStateEquals';

/**
 * Middleware for intercepting actions with type TRANSITION_TO and initiating
 * a transition.
 * @param {Router} Router instance
 */
function routerMiddleware(router) {
  return () => next => action => {
    if (action.type === TRANSITION_TO) {
      const { pathname, query, state } = action.payload;
      router.transitionTo(pathname, query, state);
    } else if (action.type === REPLACE_WITH) {
      const { pathname, query, state } = action.payload;
      router.replaceWith(pathname, query, state);
    } else {
      return next(action);
    }
  };
}

/**
 * Creates a component to be used as the `component` prop of a <Route />. Also
 * adds the store to context, serving as a replacement for <Provider />
 * @param  {Object} store - Redux store
 * @return {Component}
 */
export default function reduxRouteComponent(s) {
  return class ReduxRoute extends Component {
    static contextTypes = {
      router: PropTypes.object
    }

    static childContextTypes = {
      store: PropTypes.object
    }

    constructor(props, context) {
      super(props, context);
      const router = this.context.router;
      const dispatch = routerMiddleware(router)()(s.dispatch);
      const store = { ...s, dispatch };
      this.state = { store };
      this.unsubscribe = store.subscribe(() => this.onStateChange());
      this.onLocationChange(props, this.state, context);
    }

    getChildContext() {
      return { store: this.state.store };
    }

    componentWillReceiveProps(props) {
      this.onLocationChange(props);
    }

    storeIsInSyncWithRouter(state = this.state, context = this.context) {
      const storeState = state.store.getState();
      const storeLocationState = storeState.router.state;
      const routerLocationState = context.router.state.location.state; // LOL
      return locationStateEquals(storeLocationState, routerLocationState);
    }

    /**
     * Update store state in response to router change
     */
    onLocationChange(props = this.props, state = this.state, context = this.context) {
      const { location, params } = props;
      const { dispatch } = state.store;

      if (!this.storeIsInSyncWithRouter(state, context)) {
        dispatch(locationDidChange(location, params));
      }
    }

    /**
     * Trigger transition in response to store change from external source —
     * such as devtools or deserialization — by comparing location.state.key
     */
    onStateChange() {
      const storeState = this.state.store.getState();

      // Exit early if route state does not exist
      if (!storeState.router) {
        console.warn(
          'No router state was found at state.router. Ensure that the Redux '
        + 'reducer has been property configured using routerStateReducer()'
        );
        return;
      }

      if (!this.storeIsInSyncWithRouter()) {
        const { pathname, query, state } = storeState.router;
        // Check that pathname is defined
        if (pathname) {
          this.context.router.transitionTo(pathname, query, state);
        }
      }
    }

    componentWillUnmount() {
      this.unsubscribe();
    }

    render() {
      return this.props.children;
    }
  };
}

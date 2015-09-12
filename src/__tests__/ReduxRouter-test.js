import {
  ReduxRouter,
  reduxReactRouter,
  routerStateReducer
} from '../';

import React, { Component, PropTypes } from 'react/addons';
import { Provider, connect } from 'react-redux';
import { createStore, combineReducers } from 'redux';
import createHistory from 'history/lib/createMemoryHistory';
import { Link, Route } from 'react-router';
import jsdom from './jsdom';

const {
  renderIntoDocument,
  findRenderedComponentWithType,
  findRenderedDOMComponentWithTag,
  Simulate
} = React.addons.TestUtils;

@connect(state => state.router)
class App extends Component {
  static propTypes = {
    children: PropTypes.node
  }

  render() {
    return <div>{this.props.children}</div>;
  }
}

class Parent extends Component {
  static propTypes = {
    children: PropTypes.node
  }

  render() {
    return (
      <div>
        <Link to="/parent/child/321" query={{ key: 'value' }} />
        {this.props.children}
      </div>
    );
  }
}

class Child extends Component {
  render() {
    return (
      <div />
    );
  }
}

const routes = (
  <Route path="/" component={App}>
    <Route path="parent" component={Parent}>
      <Route path="child/:id" component={Child} />
    </Route>
  </Route>
);


describe('<ReduxRouter>', () => {
  jsdom();

  function renderApp() {
    const reducer = combineReducers({
      router: routerStateReducer
    });

    const history = createHistory();
    const store = reduxReactRouter({
      history,
      routes
    })(createStore)(reducer);

    history.pushState(null, '/parent/child/123?key=value');

    return renderIntoDocument(
      <Provider store={store}>{() =>
        <ReduxRouter />
      }</Provider>
    );
  }

  it('renders a React Router app using state from a Redux <Provider>', () => {
    const tree = renderApp();

    const child = findRenderedComponentWithType(tree, Child);
    expect(child.props.location.pathname).to.equal('/parent/child/123');
    expect(child.props.location.query).to.eql({ key: 'value' });
    expect(child.props.params).to.eql({ id: '123' });
  });

  // <Link> does stuff inside `onClick` that makes it difficult to test.
  // They work in the example.
  // TODO: Refer to React Router tests once they're completed
  it.skip('works with <Link>', () => {
    const tree = renderApp();

    const child = findRenderedComponentWithType(tree, Child);
    expect(child.props.location.pathname).to.equal('/parent/child/123');
    const link = findRenderedDOMComponentWithTag(tree, 'a');

    Simulate.click(link);
    expect(child.props.location.pathname).to.equal('/parent/child/321');
  });
});

import React, { Component, PropTypes } from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router';

@connect(state => ({ routerState: state.router }))
export const App = class App extends Component {
  static propTypes = {
    children: PropTypes.node
  }

  render() {
    // Display is only used for rendering, its not a property of <Link>
    const links = [
      { pathname: '/', display: '/'},
      { pathname: '/parent', query: { foo: 'bar' }, display: '/parent?foo=bar'},
      { pathname: '/parent/child', query: { bar: 'baz' }, display: '/parent/child?bar=baz'},
      { pathname: '/parent/child/123', query: { baz: 'foo' }, display: '/parent/child/123?baz=foo'}
    ].map((l, i) =>
        <p key={i}>
          <Link to={l}>{l.display}</Link>
        </p>
    );

    return (
      <div>
        <h1>App Container</h1>
        {links}
        {this.props.children}
      </div>
    );
  }
};

export const Parent = class Parent extends Component {
  static propTypes = {
    children: PropTypes.node
  }

  render() {
    return (
      <div>
        <h2>Parent</h2>
        {this.props.children}
      </div>
    );
  }
};

export const Child = class Child extends Component {
  render() {
    const { params: { id }} = this.props;

    return (
        <div>
          <h2>Child</h2>
          {id && <p>{id}</p>}
        </div>
    );
  }
};

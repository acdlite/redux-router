import { transitionTo, replaceWith, routerStateReducer, reduxRouteComponent } from '../';
import { LOCATION_DID_CHANGE } from '../actionTypes';
import { createStore } from 'redux';
import { Connector } from 'redux/react';
import jsdom from './jsdom';
import React, { Component, addons } from 'react/addons';
import { Router, Route } from 'react-router';
import MemoryHistory from 'react-router/lib/MemoryHistory';
import sinon from 'sinon';
const { TestUtils } = addons;

describe('reduxRouteComponent', () => {
  jsdom();

  function externalStateChange() {
    return {
      type: LOCATION_DID_CHANGE,
      payload: {
        pathname: '/two/special-something',
        query: {
          baz: 'foo'
        },
        state: {
          key: 'q7ugo9odofq7iudi'
        },
        params: {
          extra: 'special-something'
        }
      }
    };
  }

  it('responds to route changes', done => {
    class App extends Component {
      render() {
        return (
          <Connector select={s => s}>{props => (
            <Child
              {...props.router}
              externalStateChange={() => props.dispatch(externalStateChange())}
              transitionTo={(...args) => props.dispatch(transitionTo(...args))}
              replaceWith={(...args) => props.dispatch(replaceWith(...args))}
            />
          )}</Connector>
        );
      }
    }

    class Child extends Component {
      render() {
        return <div />;
      }
    }

    let child;
    const reducerSpy = sinon.spy();
    const steps = [
      function step1() {
        setImmediate(() => {
          expect(child.props.pathname).to.equal('/one');
          // Normal React Router transition
          this.transitionTo('/faketwo');
        });
      },
      function step2() {
        setImmediate(() => {
          expect(child.props.pathname).to.equal('/faketwo');
          // Normal React Router url replacement
          this.replaceWith('/two/something?foo=bar');
        });
      },
      function step3() {
        expect(child.props.pathname).to.equal('/two/something');
        expect(child.props.params).to.eql({ extra: 'something' });
        expect(child.props.query).to.eql({ foo: 'bar' });
        // Action creator transition
        child.props.transitionTo('/two/somewhat-special?top=kek');
      },
      function step4() {
        expect(child.props.pathname).to.equal('/two/somewhat-special');
        expect(child.props.params).to.eql({ extra: 'somewhat-special' });
        expect(child.props.query).to.eql({ top: 'kek' });
        // Action creator replacement
        child.props.replaceWith('/two/something-special?bar=baz');
      },
      function step5() {
        expect(child.props.pathname).to.equal('/two/something-special');
        expect(child.props.params).to.eql({ extra: 'something-special' });
        expect(child.props.query).to.eql({ bar: 'baz' });
        // External store state change transition
        // (e.g. devtools, state deserialization)
        child.props.externalStateChange();
      },
      function step6() {
        expect(child.props.pathname).to.equal('/two/special-something');
        expect(child.props.params).to.eql({ extra: 'special-something' });
        expect(child.props.query).to.eql({ baz: 'foo' });
        expect(reducerSpy.callCount).to.equal(7);
        done();
      }
    ];

    function execNextStep() {
      steps.shift().apply(this, arguments);
    }

    function reducer(state = {}, action) {
      reducerSpy();
      return {
        router: routerStateReducer(state, action)
      };
    }

    const store = createStore(reducer);

    const tree = TestUtils.renderIntoDocument(
      <Router history={new MemoryHistory('/one')} onUpdate={execNextStep}>
        <Route component={reduxRouteComponent(store)}>
          <Route component={App}>
            <Route path="one" />
            <Route path="faketwo" />
            <Route path="two/:extra" />
          </Route>
        </Route>
      </Router>
    );

    child = TestUtils.findRenderedComponentWithType(tree, Child);
  });

  it('uses state selector function to find router state', done => {
    function reducer(state = {}, action) {
      return {
        otherSpot: routerStateReducer(state, action)
      };
    }

    const store = createStore(reducer);

    class App extends Component {
      render() {
        return (
          <Connector select={s => s}>{props => (
            <Child
              {...props.otherSpot}
              externalStateChange={() => props.dispatch(externalStateChange())}
              transitionTo={(...args) => props.dispatch(transitionTo(...args))}
              replaceWith={(...args) => props.dispatch(replaceWith(...args))}
            />
          )}</Connector>
        );
      }
    }

    class Child extends Component {
      render() {
        return <div />;
      }
    }

    let child;
    const steps = [
      function step1() {
        setImmediate(() => {
          expect(child.props.pathname).to.equal('/one');
          // Normal React Router transition
          this.transitionTo('/faketwo');
        });
      },
      function step2() {
        setImmediate(() => {
          expect(child.props.pathname).to.equal('/faketwo');
          expect(store.getState().otherSpot).to.contain.property('pathname', '/faketwo');
          done();
        });
      }
    ];

    function execNextStep() {
      steps.shift().apply(this, arguments);
    }

    const tree = TestUtils.renderIntoDocument(
      <Router history={new MemoryHistory('/one')} onUpdate={execNextStep}>
        <Route component={reduxRouteComponent(store, state => state.otherSpot)}>
          <Route component={App}>
            <Route path="one" />
            <Route path="faketwo" />
            <Route path="two/:extra" />
          </Route>
        </Route>
      </Router>
    );

    child = TestUtils.findRenderedComponentWithType(tree, Child);
  });
});

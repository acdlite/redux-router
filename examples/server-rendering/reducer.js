import {combineReducers} from 'redux';
import {routerStateReducer} from '../../lib'; // 'redux-router';

export default combineReducers({
  router: routerStateReducer
});

import { routerDidChange } from './actionCreators';
import { MATCH } from './constants';

export default function matchMiddleware(match) {
  return ({ dispatch }) => next => action => {
    if (action.type === MATCH) {
      const { url, callback } = action.payload;
      match(url, (error, redirectLocation, routerState) => {
        if (!error && !redirectLocation) {
          dispatch(routerDidChange(routerState));
        }
        callback(error, redirectLocation, routerState);
      });
    }
    return next(action);
  };
}

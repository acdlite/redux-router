import { REPLACE_STATE } from './constants';

export default function replaceState(state, pathname, query) {
  return {
    type: REPLACE_STATE,
    payload: { state, pathname, query }
  };
}

import { PUSH_STATE } from './constants';

export default function transitionTo(state, pathname, query) {
  return {
    type: PUSH_STATE,
    payload: { state, pathname, query }
  };
}

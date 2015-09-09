import { PUSH_STATE } from './constants';

export default function transitionTo(...args) {
  return {
    type: PUSH_STATE,
    payload: args
  };
}

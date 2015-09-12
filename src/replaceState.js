import { REPLACE_STATE } from './constants';

export default function replaceState(...args) {
  return {
    type: REPLACE_STATE,
    payload: args
  };
}

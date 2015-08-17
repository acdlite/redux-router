import { REPLACE_WITH } from './actionTypes';

/**
 * Action creator for triggering a router url replacement. Accepts a payload which is
 * either a pathname or an object with { pathname, query, params, state },
 * corresponding to the params of router.replaceWith().
 * @param  {String|Object} payload - Pathname or object
 * @return {Object} Action object
 */
export default function replaceWith(pathname, query, state) {
  return {
    type: REPLACE_WITH,
    payload: { pathname, query, state }
  };
}

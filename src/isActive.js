import _isActive from 'react-router/lib/isActive';

/**
 * Creates a router state selector that returns whether or not the given
 * pathname and query are active.
 * @param {String} pathname
 * @param {Object} query
 * @param {Boolean} indexOnly
 * @return {Boolean}
 */
export default function isActive(pathname, query, indexOnly = false) {
  return state => {
    if (!state) return false;
    const { location, params, routes } = state;
    return _isActive(pathname, query, indexOnly, location, routes, params);
  };
}

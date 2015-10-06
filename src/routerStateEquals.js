import deepEqual from 'deep-equal';
import { DOES_NEED_REFRESH } from './constants';

/**
 * Check if two router states are equal. Ignores `location.key`.
 * @returns {Boolean}
 */
export default function routerStateEquals(a, b) {
  if (!a && !b) return true;
  if ((a && !b) || (!a && b)) return false;
  if (a[DOES_NEED_REFRESH] || b[DOES_NEED_REFRESH]) return false;

  return (
    a.location.pathname === b.location.pathname &&
    a.location.hash == b.location.hash &&
    a.location.search === b.location.search &&
    deepEqual(a.location.state, b.location.state)
  );
}

import deepEqual from 'deep-equal';

/**
 * Check if two router states are equal. Ignores `location.key`.
 * @returns {Boolean}
 */
export default function routerStateEquals(a, b) {
  if (!a && !b) return true;
  if ((a && !b) || (!a && b)) return false;

  return (
    a.location.pathname === b.location.pathname &&
    a.location.search === b.location.search &&
    deepEqual(a.location.state, b.location.state)
  );
}

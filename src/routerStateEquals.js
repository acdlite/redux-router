/**
 * Check if two router states are equal, using location.key.
 * @returns {Boolean}
 */
export default function routerStateEquals(r1, r2) {
  const key1 = r1 && r1.location && r1.location.key;
  const key2 = r2 && r2.location && r2.location.key;
  return key1 === key2;
}

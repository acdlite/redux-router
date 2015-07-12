/**
 * Check if two location states are equal, using location.key. If both keys are
 * non-existent, return true.
 * @param [object] l1 - Location state (HTML5 pushState)
 * @param [object] l2 - Location state (HTML5 pushState)
 * @returns {Boolean}
 */
export default function locationStateEquals(l1, l2) {
  const l1Key = l1 && l1.key;
  const l2Key = l2 && l2.key;

  return (!l1Key && !l2Key) || (l1Key === l2Key);
}

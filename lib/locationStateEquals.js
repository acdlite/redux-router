"use strict";

exports.__esModule = true;
/**
 * Check if two location states are equal, using location.key.
 * @param [object] l1 - Location state (HTML5 pushState)
 * @param [object] l2 - Location state (HTML5 pushState)
 * @returns {Boolean}
 */
exports["default"] = locationStateEquals;

function locationStateEquals(l1, l2) {
  var l1Key = l1 && l1.key;
  var l2Key = l2 && l2.key;
  return l1Key === l2Key;
}

module.exports = exports["default"];
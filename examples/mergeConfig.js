import merge from 'lodash/object/merge';

export default function mergeConfig(...configs) {
  return merge({}, ...configs, (a, b) => {
    if (Array.isArray(a)) {
      return a.concat(b);
    }
  });
}

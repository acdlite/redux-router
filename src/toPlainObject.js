export default function(state) {
  return state.toJSON ? state.toJSON() : state;
}
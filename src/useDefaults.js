const defaults = {
  onError: error => { throw error; },
  routerStateSelector: state => state.router
};

export default function useDefaults(next) {
  return options => createStore => (reducer, initialState) => {
    const optionsWithDefaults = { ...defaults, ...options };

    const {
      createHistory: baseCreateHistory,
      history: baseHistory,
    } = optionsWithDefaults;

    let createHistory;
    if (typeof baseCreateHistory === 'function') {
      createHistory = baseCreateHistory;
    } else if (baseHistory) {
      createHistory = () => baseHistory;
    } else {
      createHistory = null;
    }

    return next({
      ...optionsWithDefaults,
      createHistory
    })(createStore)(reducer, initialState);
  };
}

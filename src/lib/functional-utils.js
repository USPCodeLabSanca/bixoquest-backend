module.exports.compose = (...funcs) => funcs.reduce((g, f) => (x) => g(f(x)), (x) => x);

module.exports.curry = (func) => function curried(...args) {
  if (args.length >= func.length) {
    return func.apply(this, args);
  }
  return function (...args2) {
    return curried.apply(this, args.concat(args2));
  };
};

import exceptionHandler from './exceptionHandler';
const wrap = fn => (...args) => fn(...args)
    .then(result => args[1].json(result))
    .catch(e => exceptionHandler(e, args[1]));
export default wrap;

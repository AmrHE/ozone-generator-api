//Higher Order Function (HOF) to catch our Asyncronous errors
export default (fn) => {
	return (req, res, next) => {
		fn(req, res, next).catch(next);
	};
};

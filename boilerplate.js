export default async function handler(req, res) {
	// res.status(201).send('Hi there !!!');
	res.setHeader('Access-Control-Allow-Origin', '*');
	protectRoute(req, res)
		.then(async (result) => {
			if (result.statusCode === 401) {
				console.log({ result });
				console.log({ result: result.message });
				res.status(401).send({
					status: 'fail',
					message: result.message,
				});
			} else {
			}
		})
		.catch((err) => {
			console.log(err.message);
			res.status(400).send({ err, message: 'something went wrong!!' });
		});
}

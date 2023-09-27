import { connectMongoDB } from '../../../../../../../src/libs/MongoConnect';
import protectClientRoute from '../../../../../../../src/utils/protectClientRoutes';

// import protectClientRoute from '../../../src/utils'
import SummaryLog from '../../../../../../../src/models/SummaryLogModel';

export default async function handler(req, res) {
	// res.status(201).send('Hi there !!!');
	res.setHeader('Access-Control-Allow-Origin', '*');

	protectClientRoute(req, res)
		.then(async (result) => {
			if (result.statusCode === 401) {
				console.log({ result });
				console.log({ result: result.message });
				res.status(401).send({
					status: 'fail',
					message: result.message,
				});
			} else {
				if (req.method !== 'GET') {
					res.status(405).json({ message: 'Only GET requests are allowed.' });
					return;
				}

				try {
					await connectMongoDB();

					console.log('!!DB CONNECTED SUCCCESSFULLY!!');

					const summaryLogs = await SummaryLog.find();

					// Log.create({ log }).then((data) => {
					console.log(summaryLogs);
					res.status(200).send(summaryLogs);
					// });
				} catch (error) {
					console.log(error.message);
					res.status(400).send({ error, message: 'something went wrong!!' });
				}
			}
		})
		.catch((err) => {
			console.log(err.message);
			res.status(400).send({ err, message: 'something went wrong!!' });
		});
}

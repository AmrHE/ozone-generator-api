import { connectMongoDB } from '../../../../../../../../src/libs/MongoConnect';
import SummaryLog from '../../../../../../../../src/models/SummaryLogModel';

export default async function handler(req, res) {
	if (req.method !== 'POST') {
		res.status(405).send({ message: 'Only POST requests are allowed.' });
		return;
	}

	let { data } = req.body;

	const { sensorId } = req.query;
	// console.log({ sensorId });

	try {
		await connectMongoDB();

		const log = await SummaryLog.create({
			sensor: sensorId,
			data,
		});
		// .then((data) => {
		// console.log(log);
		res.status(201).send(log);
		// });
	} catch (error) {
		console.log(error.message);
		res.status(400).send({ error, message: 'something went wrong!!' });
	}
}

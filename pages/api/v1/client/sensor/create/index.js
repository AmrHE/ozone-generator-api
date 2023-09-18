import { connectMongoDB } from '../../../../../../src/libs/MongoConnect';
import { createAndSendToken } from '../../../../../../src/utils/createAndSendSensorJWT';
import Sensor from '../../../../../../src/models/SensorModel';
// import Company from '../../../../../../src/models/CompanyModel';

export default async function handler(req, res) {
	if (req.method !== 'POST') {
		res.status(405).send({ message: 'Only POST requests are allowed.' });
		return;
	}

	try {
		let { sensorName, password, passwordConfirm } = req.body;
		await connectMongoDB();

		const newSensor = await Sensor.create({
			sensorName,
			password,
			passwordConfirm,
			companies: ['650894f27728f64ab7dca635'],
		});

		createAndSendToken(newSensor, 201, req, res);
		// res.status(201).send(data);
	} catch (error) {
		console.log(error.message);
		res.status(400).send({ error, message: error.message });
	}
}

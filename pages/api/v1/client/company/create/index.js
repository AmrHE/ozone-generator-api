import { connectMongoDB } from '../../../../../../src/libs/MongoConnect';
import { createAndSendToken } from '../../../../../../src/utils/createAndSendCompanyJWT';
import Company from '../../../../../../src/models/CompanyModel';

export default async function handler(req, res) {
	if (req.method !== 'POST') {
		res.status(405).send({ message: 'Only POST requests are allowed.' });
		return;
	}

	let { companyName, password, passwordConfirm, sensors } = req.body;

	try {
		await connectMongoDB();

		const newCompany = await Company.create({
			companyName,
			password,
			passwordConfirm,
			sensors,
		});

		createAndSendToken(newCompany, 201, req, res);
		// res.status(201).send(data);
	} catch (error) {
		console.log(error.message);
		res.status(400).send({ error, message: error.message });
	}
}

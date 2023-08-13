import { connectMongoDB } from '../../../../../../src/libs/MongoConnect';
import Company from '../../../../../../src/models/CompanyModel';
// import AppError from '../../../../../../src/utils/appError';
import { createAndSendToken } from '../../../../../../src/utils/createAndSendCompanyJWT';

export default async function handler(req, res) {
	// console.log(req.method);
	// res.status(405).send({ message: 'Only POST requests are allowed.' });
	if (req.method !== 'POST') {
		console.log(req.method);
		res.status(405).send({ message: 'Only POST requests are allowed.' });
		return;
	}

	const { companyName, password } = req.body;

	try {
		await connectMongoDB();

		//1) Check if company name and password exist
		if (!companyName || !password) {
			return res
				.status(400)
				.send({ message: 'Please provide your company name and password' });

			// return new AppError('Please provide your company name and password', 400);
		}

		//2)Check if the comapny exists && if the password is correct
		const company = await Company.findOne({ companyName: companyName }).select(
			'+password'
		);

		if (
			!company ||
			!(await company.correctPassword(password, company.password))
		) {
			// return new AppError('Incorrect Email or password', 401);
			res.status(401).send({ message: 'Incorrect Email or password' });
		}

		//3)If everything is ok, send token to client
		createAndSendToken(company, 200, req, res);
	} catch (error) {
		console.log(error.message);
		res.status(400).send({ error, message: 'something went wrong!!' });
	}
}

/**
 * @swagger
 * \api\v1\client\company\authenticate-company:
 *   post:
 *     summary: Authenticate Sensor And Get Access Token
 *     tags:
 *       - Client Endpoints
 *     requestBody:
 *      content:
 *        application/json:
 *          schema:            # Request payload
 *            type: object
 *            properties:      # Request parts
 *              companyName:
 *                type: string
 *              password:
 *                type: string
 *     description: Authenticates the device and returns the token and the device
 *     responses:
 *      200:
 *         description: success
 *      400:
 *         description: something went wrong!!.
 *      401:
 *         description: Please provide your sensor name and password.
 *      405:
 *         description: Only POST requests are allowed.
 *
 */

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

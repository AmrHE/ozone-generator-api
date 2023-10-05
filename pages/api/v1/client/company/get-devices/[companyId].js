/**
 * @swagger
 * \api\v1\client\company\get-devices\{company_id}:
 *   get:
 *     summary: Get All Devices/sensors
 *     parameters:
 *       - in: path
 *         name: company_id
 *     tags:
 *       - Client Endpoints
 *     description: Get Company Sensors
 *     responses:
 *      200:
 *         description: Success
 *      400:
 *         description: something went wrong!!.
 *      401:
 *         description: Unauthorized
 *      404:
 *         description: No document found with this ID
 *      405:
 *         description: Only GET requests are allowed.
 *
 */

import { connectMongoDB } from '../../../../../../src/libs/MongoConnect';
import Company from '../../../../../../src/models/CompanyModel';
import Sensor from '../../../../../../src/models/SensorModel';
import protectClientRoute from '../../../../../../src/utils/protectClientRoutes';
export default async function handler(req, res) {
	res.setHeader('Access-Control-Allow-Origin', '*');
	await connectMongoDB();
	console.log('!!DB CONNECTED SUCCCESSFULLY!!');

	console.log(req.headers);

	protectClientRoute(req, res)
		.then(async (result) => {
			console.log({ result });
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

				// if (req.query.companyId == result.company._id) {
				try {
					const company = await Company.findById(req.query.companyId);

					console.log({ company });

					if (!company) {
						res.status(404).send('No document found with this ID');

						// next(new AppError('', 404));
					} else {
						const fullCompanyData = await company.populate('sensors');

						const devices = fullCompanyData?.sensors;
						res.status(200).send(devices); //TODO EDIT RESPONSE
					}
				} catch (error) {
					console.log(error.message);
					res.status(400).send({ error, message: error.message });
				}
			}

			// res
			// 	.status(400)
			// 	.send({ message: 'You are not authorized to get this data' });
			// }
		})
		.catch((err) => {
			console.log(err.message);
			res.status(400).send({ err, message: err.message });
		});
}

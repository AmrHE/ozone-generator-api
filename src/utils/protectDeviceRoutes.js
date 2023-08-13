import jwt from 'jsonwebtoken';
import { promisify } from 'util';
import Sensor from '../models/SensorModel';
import AppError from './appError';
import { connectMongoDB } from '../libs/MongoConnect';

// const { promisify } = require('util');

//Check if the sensor is logged in or not, and if so, check if the sensor exists or not FOR PROTECTED ROUTES
const protectSensorRoutes = async (req, res) => {
	await connectMongoDB();

	// 1) Get the token and check if it exists
	let token;

	//1.1) Get the token from the req.headers
	if (
		req.headers.authorization &&
		req.headers.authorization.startsWith('Bearer')
	) {
		token = req.headers.authorization.split(' ')[1];
	} else if (req.cookies.jwt) {
		token = req.cookies.jwt;
	}

	//1.2) Check if it exists or not
	if (!token) {
		return new AppError(
			'You are not logged in! Please login to get access.',
			401
		);
		// next(
		// );
	}
	console.log({ token });
	console.log({ JWT_SECRET: process.env.JWT_SECRET });

	// 2) Verify/Validate the token (Verify if someone manipulated the data) OR (If the token has already expired)
	const decodedPayload = await promisify(jwt.verify)(
		token,
		process.env.JWT_SECRET
	);

	console.log('ID: ', decodedPayload.id);

	// 3) Check if sensor still exists //(or has been deleted from DB after the JWT has created/issued)
	const currentSensor = await Sensor.findById(decodedPayload.id);

	console.log({ currentSensor });

	if (!currentSensor) {
		return new AppError('The sensor does no longer exist', 401);
		// next();
	}

	// 4) Check if the sensor changed password after the JWT is created/issued
	if (currentSensor.changedPasswordAfterJWT(decodedPayload.iat)) {
		return new AppError(
			'Sensor recently changed the password! Please login again.',
			401
		);
		// next();
	}

	//GRANT ACCESS TO PROTECTED ROUTE
	// req.sensor = currentSensor; //Here we pass the currentSensor to the req object in order to make this data avilable in the next middleware of the middleware stakem
	// res.locals.sensor = currentSensor; //Here we pass the currentSensor to the res.locals in order to make this data available in the every and each pug template as they all have access to res.locals

	return { sensor: currentSensor };
	// next();
};

export default protectSensorRoutes;

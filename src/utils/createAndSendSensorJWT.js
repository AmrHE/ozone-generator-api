import jwt from 'jsonwebtoken';
import { serialize } from 'cookie';

const signToken = (id) => {
	return jwt.sign({ id }, process.env.JWT_SECRET, {
		expiresIn: process.env.JWT_EXPIRES_IN,
	});
};

//Function to SEND the created token from the above function to the client
export const createAndSendToken = (sensor, statusCode, req, res) => {
	const token = signToken(sensor._id);

	//we use this instead of specifying it in the object

	// if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;

	res.setHeader(
		'Set-Cookie',
		serialize('jwt', token, {
			//convert the date from days to milliseconds
			expires: new Date(
				Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
			),
			//This option means that the cookie will only be send on encrypted connection (HTTPS)
			// secure: true,

			//This option makes the cookie cannot be accessed or modified in the browser
			httpOnly: true,
			//Check if connection is secure or not when our app is deployed to heruko
			// secure: req.secure || req.headers('x-forwarded-proto') === 'https',
		})
	);

	//To hide the password from the res object
	sensor.password = undefined;

	res.status(statusCode).json({
		status: 'success',
		token: token,
		data: {
			sensor,
		},
	});
};

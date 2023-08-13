// import { NextResponse } from 'next/server';
// import AppError from './src/utils/appError';

// // This function can be marked `async` if using `await` inside
export async function middleware(req) {
	// 	// if (req.nextUrl.pathname == '/api/hello') {
	// 	// if (req.nethod != 'POST') {
	// 	// 	return new NextResponse(
	// 	// 		'Cannot access this endpoint with ' + req.method,
	// 	// 		{ status: 400 }
	// 	// 	);
	// 	// }
	// 	// console.log(req.nextUrl.pathname);
	// 	// return NextResponse.NextResponse.next();
	// 	// }
	// 	let token;
	// 	//1.1) Get the token from the req.headers
	// 	if (
	// 		req.headers.authorization &&
	// 		req.headers.authorization.startsWith('Bearer')
	// 	) {
	// 		token = req.headers.authorization.split(' ')[1];
	// 	} else if (req.cookies.jwt) {
	// 		token = req.cookies.jwt;
	// 	}
	// 	//1.2) Check if it exists or not
	// 	if (!token) {
	// 		return NextResponse.next(
	// 			new AppError('You are not logged in! Please login to get access.', 401)
	// 		);
	// 	}
	// 	console.log({ token });
	// 	console.log({ JWT_SECRET: process.env.JWT_SECRET });
	// 	// // 2) Verify/Validate the token (Verify if someone manipulated the data) OR (If the token has already expired)
	// 	// const decodedPayload = await promisify(jwt.verify)(
	// 	// 	token,
	// 	// 	process.env.JWT_SECRET
	// 	// );
	// 	// console.log('ID: ', decodedPayload.id);
	// 	// // 3) Check if company still exists //(or has been deleted from DB after the JWT has created/issued)
	// 	// const currentCompany = await Company.findById(decodedPayload.id);
	// 	// console.log({ currentCompany });
	// 	// if (!currentCompany) {
	// 	// 	return NextResponse.next(
	// 	// 		new AppError('The company does no longer exist', 401)
	// 	// 	);
	// 	// }
	// 	// // 4) Check if the company changed password after the JWT is created/issued
	// 	// if (currentCompany.changedPasswordAfterJWT(decodedPayload.iat)) {
	// 	// 	return NextResponse.next(
	// 	// 		new AppError(
	// 	// 			'Company recently changed the password! Please login again.',
	// 	// 			401
	// 	// 		)
	// 	// 	);
	// 	// }
	// 	// //GRANT ACCESS TO PROTECTED ROUTE
	// 	// // req.company = currentCompany; //Here we pass the currentCompany to the req object in order to make this data avilable in the next middleware of the middleware stakem
	// 	// // res.locals.company = currentCompany; //Here we pass the currentCompany to the res.locals in order to make this data available in the every and each pug template as they all have access to res.locals
	// 	// return NextResponse.next({ company: currentCompany });
}

// // // See "Matching Paths" below to learn more
// // export const config = {
// // 	matcher: '/about/:path*',
// // };

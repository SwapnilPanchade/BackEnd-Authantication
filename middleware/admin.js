/** @format */

const { Admin } = require("../db");
const jwt = require("jsonwebtoken");
const { secret } = require("../config");

// Middleware for handling auth
function adminMiddleware(req, res, next) {
	// Implement admin auth logic
	// You need to check the headers and validate the admin from the admin DB. Check readme for the exact headers to be expected
	const token = req.headers.authorization;
	const words = token.split(" ");
	const jwtToken = words[1];
	const decoadedValue = jwt.verify(jwtToken, secret);
	try {
		if (decoadedValue.username) {
			next();
		} else {
			res.status(411).json({
				message: "your not authanticated to admin",
			});
		}
	} catch (err) {
		res.json({
			msg: "incorrect input",
		});
	}
}

module.exports = adminMiddleware;

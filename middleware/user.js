/** @format */

const { User } = require("../db");
const jwt = require("jsonwebtoken");
const { secret } = require("../config");
function userMiddleware(req, res, next) {
	// Implement user auth logic
	// You need to check the headers and validate the user from the user DB. Check readme for the exact headers to be expected
	const token = req.headers.authorization;
	const words = token.split("");
	const jwtToken = words[1];
	const decoadedValue = jwt.verify(jwtToken, secret);
	if (decoadedValue.username) {
		req.headers = decoadedValue.username;
		next();
	} else {
		res.status(440).json({
			message: "You are not an autharized user",
		});
	}
}

module.exports = userMiddleware;

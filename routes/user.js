/** @format */
const jwt = require("jsonwebtoken");
const { Router } = require("express");
const router = Router();
const userMiddleware = require("../middleware/user");
const { User, Course } = require("../db");
const { secret } = require("../config");

// User Routes
router.post("/signup", async (req, res) => {
	// Implement user signup logic
	const username = req.body.username;
	const password = req.body.password;
	//prettier-ignore
	const user = await User.create({
		username,
		password,
	})
	res.jsonI((user) => {
		msg: "user is created", user;
	});
});

router.post("/signin", (req, res) => {
	// Implement admin signup logic
	const username = req.body.username;
	const password = req.body.password;

	User.findOne({
		username: username,
		password: password,
	})
		.then((user) => {
			const token = jwt.sign({ username }, secret);
			res.json({
				token,
			});
		})
		.catch((err) => {
			res.json({
				err,
			});
		});
});

router.get("/courses", (req, res) => {
	// Implement listing all courses logic
	Course.find({}).then((response) => {
		res.json({
			response,
		});
	});
});

router.post("/courses/:courseId", userMiddleware, (req, res) => {
	// Implement course purchase logic
	const username = req.username;
	const courseId = req.params.courseId;

	User.updateOne({
		username: username,
	})
		.then(
			res.json({
				msg: "your course purchase is successfull",
				$push: {
					purchasedCourses: courseId,
				},
			})
		)
		.catch((err) => {
			res.json({
				msg: "your purchase is not successfull",
				err,
			});
		});
});

router.get("/purchasedCourses", userMiddleware, (req, res) => {
	// Implement fetching purchased courses logic
	const gentoken = req.headers.authorization;
	const words = gentoken.split("");
	const token = words[1];
	const finalValue = jwt.verify(token, secret);
	if (finalValue) {
		User.find({
			username: username,
		})
			.then((user) => {
				return Course.find({ _id: { $in: user.purchasedCourses } });
			})
			.then((response) => {
				res.json({
					response,
				});
			})
			.catch((err) => {
				res.json({
					msg: "some error occured while loading your courses",
					err,
				});
			});
	}
});

module.exports = router;

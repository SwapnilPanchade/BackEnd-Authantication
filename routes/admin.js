/** @format */

const { Router } = require("express");
const adminMiddleware = require("../middleware/admin");
const { Admin, Course } = require("../db");
const router = Router();
const jwt = require("jsonwebtoken");
const { secret } = require("../config");

// Admin Routes
router.post("/signup", (req, res) => {
	// Implement admin signup logic
	const username = req.body.username;
	const password = req.body.password;
	Admin.create({
		username,
		password,
	})
		.then(
			res.json({
				msg: "Admin signup successfull",
			})
		)
		.catch((err) => {
			res.json({
				err,
			});
		});
});

router.post("/signin", async (req, res) => {
	// Implement admin signup logic
	const username = req.body.username;
	const password = req.body.password;

	const user = await Admin.find({
		username,
		password,
	});

	if (user) {
		const token = jwt.sign(
			{
				username,
			},
			secret
		);
		res.json({
			token,
		});
	} else {
		res.status(411).json({
			message: "you are not authorized to us",
		});
	}
});

router.post("/courses", adminMiddleware, (req, res) => {
	// Implement course creation logic
	const title = req.body.title;
	const description = req.body.description;
	const price = req.body.price;
	const imageLink = req.body.imageLink;

	Course.create({
		title,
		description,
		price,
		imageLink,
	})
		.then((courses) => {
			res.json({
				msg: "your course is created successfully",
				courseId: courses._id,
			});
		})
		.catch((err) => {
			res.json({
				msg: "there is some error creating the courses",
				err,
			});
		});
});

router.get("/courses", adminMiddleware, (req, res) => {
	// Implement fetching all courses logic
	Course.find({})
		.then((response) => {
			res.json({
				courses: response,
			});
		})
		.catch((err) => {
			res.json({
				err,
			});
		});
});

module.exports = router;

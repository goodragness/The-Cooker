const express = require("express");
const { decideMeal } = require("../controllers/decideMealController");

const router = express.Router();

// the route only points the request to the controller; the logic lives there
router.post("/", decideMeal);

module.exports = router;

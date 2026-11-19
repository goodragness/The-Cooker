// controller: handles the logic for the decide-meal form submission
const { PromptBuilder} = require("../services/PromptBuilder");
// importing the askGroq from the groqClient file:
const {askGroq} = require("../services/groqClient.js");


async function decideMeal(req, res) {
    // abstracting data sent from the request:
    const formData = req.body;
    console.log("received data from the form");

    // checking if any of the important form data is missing:
    if (!formData.moodRating || !formData.cookingTimeMinutes || !formData.finishBy) {
        return res.status(400).json({ error: "Missing important values" });
    }

    try {

        // so in try, we will call the goq client to get groq's output.
        const prompt = PromptBuilder(formData);  //built the prompt
        const meals = await askGroq(prompt);    //sent the prompt to askGroq to generate an output
        res.status(200).json({ meals });     // the status of res set to be 200 and converting meals into jso to send to frontend.
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to generate meal options" });
    }
}

module.exports = { decideMeal };

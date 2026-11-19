//this file helps to build the prompt which will be sent to groq helping to decide
//what the person can cook with the fillers.
const fs = require("fs");
const path = require("path");

//Groq_URL
const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";

// the prompt renderer: reads a file and replaces {{placeholders}} with values
function fileRender(filePath, variables = {}) {
    // resolve relative to this file's folder, so it works no matter where node is started from
    const fullPath = path.resolve(__dirname, filePath);

    // read the file's content as text
    const template = fs.readFileSync(fullPath, "utf-8");

    // swap every {{key}} for variables[key]; leave unknown placeholders untouched
    return template.replace(/\{\{\s*(\w+)\s*\}\}/g, (match, key) =>
        key in variables ? String(variables[key]) : match
    );
}

// building the prompt from the form data
function PromptBuilder(formData) {
    const groceries = (formData.groceries || [])
        .map((g) => (g.quantity ? `${g.quantity} ${g.name}` : g.name))
        .join(", ");

    const dietary = [...(formData.dietaryRequirements || []), formData.otherDietaryRequirement]
        .filter(Boolean)
        .join(", ");

    return fileRender("../prompts/decideMeal.txt", {
        moodRating: formData.moodRating,
        cookingTimeMinutes: formData.cookingTimeMinutes,
        finishBy: formData.finishBy,
        groceries: groceries || "none listed",
        wouldRatherEat: formData.wouldRatherEat || "no preference",
        dietaryRequirements: dietary || "none",
    });
}



module.exports = { fileRender, PromptBuilder};

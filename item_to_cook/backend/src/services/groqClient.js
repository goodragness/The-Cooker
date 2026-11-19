const fs = require("fs");
const path = require("path");

const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";

//defining the groqAsk function that will be called to send a request to groq
//and expect an output as well.

async function askGroq(prompt){
//     getting the API from the .env file:
    const GroqAPIKey = process.env.GROQ_API_KEY;

    // if we don't have the api key
    if(!GroqAPIKey){
        throw new Error("Please provide a groq api key");

    }
//     if the prompt sent is empty or the type is not string
    if(typeof prompt !== "string" || !prompt.trim()){
        throw new Error("Please provide a non-empty prompt to generate the output");
    }


//     sending a request to groq
//     defining the header of the request
//     defining the body of the request

    const response = await fetch(GROQ_URL, {
        method:"POST",
        headers: {
            Authorization: `Bearer ${GroqAPIKey}`,
            "Content-Type":"application/json",
        },
        body: JSON.stringify({
            model:"openai/gpt-oss-120b",
            messages:[
                {role:"user", content:prompt},
            ],
        }),
        signal: AbortSignal.timeout(30_000),
    });

    if(!response.ok){
        throw new Error(`Groq request failed: HTTP ${response.status}`);
    }



//     getting teh content or data from the response.
    const data = await response.json();   // wait until we store the response to the data constant/.
    const answer = data.choices?.[0]?.message?.content;

    if (typeof answer !== "string" || !answer.trim()) {
        throw new Error("Groq returned an empty or invalid response");
    }

    return answer;


}

//exporting the service
module.exports = {askGroq};

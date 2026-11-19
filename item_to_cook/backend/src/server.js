const express = require("express");

const cors = require("cors");

//importing al the route files so that I can use the routes of those files to direct requests to.
const submittedFormDataRoute = require("./routes/SubmittedFormData");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/decide_meal_form", submittedFormDataRoute);

app.listen(3000 , ()=>{
    console.log("Server is running on port 3000. " +
        "http://localhost:3000");
});


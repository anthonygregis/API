const express = require("express");
const bodyParser = require("body-parser");
import LogRocket from 'logrocket';
LogRocket.init('zwqirp/api');
const PORT = process.env.PORT || 3000

const app = express();

// parse requests of content-type: application/json
app.use(bodyParser.json());

// parse requests of content-type: application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to LifeInvader REST API" });
});

require("./routes/user.js")(app);

// set port, listen for requests
app.listen(3000, () => {
  console.log("Server is running on port 3000.");
});
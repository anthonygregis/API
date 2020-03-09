module.exports = app => {
    const token = require("../controllers/auth.js");

    //Create a token
    app.post("/token", token.create)

  };
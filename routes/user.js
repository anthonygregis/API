module.exports = app => {
  const users = require("../controllers/user.js");

  // Create a new Customer
  app.post("/users", users.create);

  // Retrieve all Customers
  app.get("/users", users.findAll);

  // Retrieve a single Customer with customerId
  app.get("/users/:userUuid", users.findOne);

  // Update a Customer with customerId
  app.put("/users/:userUuid", users.update);

  // Delete a Customer with customerId
  app.delete("/users/:userUuid", users.delete);

  // Create a new Customer
  app.delete("/users", users.deleteAll);
};
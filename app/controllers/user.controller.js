const User = require("../models/user.model.js");

// Create and Save a new Customer
exports.create = (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }

  // Create a Customer
  const user = new User({
    username: req.body.username,
    fname: req.body.fname,
    lname: req.body.lname,
    phone: req.body.phone,
    password: req.body.password,
    passphrase: req.body.passphrase,
    user_level: req.body.user_level,
    created_at: req.body.created_at
  });

  // Save Customer in the database
  User.create(user, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the User."
      });
    else res.send(data);
  });
};

// Retrieve all Customers from the database.
exports.findAll = (req, res) => {
    User.getAll((err, data) => {
      if (err)
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving users."
        });
      else res.send(data);
    });
};

// Find a single Customer with a userUuid
exports.findOne = (req, res) => {
    User.findByUuid(req.params.userUuid, (err, data) => {
      if (err) {
        if (err.kind === "not_found") {
          res.status(404).send({
            message: `Not found User with uuid ${req.params.userUuid}.`
          });
        } else {
          res.status(500).send({
            message: "Error retrieving User with uuid " + req.params.userUuid
          });
        }
      } else res.send(data);
    });
};

// Update a Customer identified by the userUuid in the request
exports.update = (req, res) => {
    // Validate Request
    if (!req.body) {
      res.status(400).send({
        message: "Content can not be empty!"
      });
    }
  
    User.updateByUuid(
      req.params.userUuid,
      new User(req.body),
      (err, data) => {
        if (err) {
          if (err.kind === "not_found") {
            res.status(404).send({
              message: `Not found User with id ${req.params.userUuid}.`
            });
          } else {
            res.status(500).send({
              message: "Error updating User with id " + req.params.userUuid
            });
          }
        } else res.send(data);
      }
    );
};

// Delete a Customer with the specified userUuid in the request
exports.delete = (req, res) => {
    User.remove(req.params.userUuid, (err, data) => {
      if (err) {
        if (err.kind === "not_found") {
          res.status(404).send({
            message: `Not found User with uuid ${req.params.userUuid}.`
          });
        } else {
          res.status(500).send({
            message: "Could not delete User with id " + req.params.userUuid
          });
        }
      } else res.send({ message: `User was deleted successfully!` });
    });
};

// Delete all Customers from the database.
exports.deleteAll = (req, res) => {
    User.removeAll((err, data) => {
      if (err)
        res.status(500).send({
          message:
            err.message || "Some error occurred while removing all users."
        });
      else res.send({ message: `All Users were deleted successfully!` });
    });
};
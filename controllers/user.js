const User = require("../models/user.js");
const { v4: uuidv4 } = require('uuid')
const bcrypt = require('bcrypt');
const saltRounds = 10;
const bip39 = require('bip39');
const date = require('date-and-time');
const now = new Date();


// Create and Save a new User
exports.create = (req, res) => {
    // Validate request
    if (!req.body) {
      res.status(400).send({
        message: "Content can not be empty!"
      });
    }
  
    // Create a User
    const createuser = new User({
      uuid: uuidv4(),
      username: req.body.username,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      phone: req.body.phone,
      password: bcrypt.hashSync(req.body.password, saltRounds),
      recoveryPhrase: bip39.generateMnemonic(),
      permissionLevel: req.body.permissionLevel,
      createdAt: date.format(now, 'YYYY/MM/DD HH:mm:ss')
    });
  
    // Save User in the database
    User.create(createuser, (err, data) => {
      if (err)
        res.status(500).send({
          message:
            err.message || "Some error occurred while creating the User."
        });
      else res.send(data);
    });
  };

// Retrieve all Users from the database.
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

// Find a single User with a userUuid
exports.findOne = (req, res) => {
    User.findByUuid(req.params.userUuid, (err, data) => {
      if (err) {
        if (err.kind === "not_found") {
          res.status(404).send({
            message: `Could not find user with UUID ${req.params.userUuid}.`
          });
        } else {
          res.status(500).send({
            message: "Error retrieving user with UUID " + req.params.userUuid
          });
        }
      } else res.send(data);
    });
  };

// Update a User identified by the userUuid in the request
exports.update = (req, res) => {
  // Validate Request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }

  const updateuser = new User({
    uuid: req.params.userUuid,
    username: req.body.username,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    phone: req.body.phone,
    password: bcrypt.hashSync(req.body.password, saltRounds),
    permissionLevel: req.body.permissionLevel
  });
  
  User.updateByUuid(updateuser, (err, data) => {
      if (err) {
        if (err.kind === "not_found") {
          res.status(404).send({
            message: `Could not find user with UUID ${req.params.userUuid}.`
          });
        } else {
          res.status(500).send({
            message: "Error updating user with UUID " + req.params.userUuid
          });
        }
      } else res.send(data);
    }
  );
};

// Delete a User with the specified userUuid in the request
exports.delete = (req, res) => {
  User.remove(req.params.userUuid, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Could not find user with UUID ${req.params.userUuid}.`
        });
      } else {
        res.status(500).send({
          message: "Could not delete user with UUID " + req.params.userUuid
        });
      }
    } else res.send({ message: `User was deleted successfully!` });
  });
};

// Delete all Users from the database.
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
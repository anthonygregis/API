const pool = require("../utils/database.js");

// constructor
const User = function(user) {
  this.uuid = user.uuid;
  this.username = user.username;
  this.fname = user.firstName;
  this.lname = user.lastName;
  this.phone = user.phone;
  this.password = user.password;
  this.passphrase = user.recoveryPhrase;
  this.user_level = user.permissionLevel;
  this.created_at = user.createdAt;
};

User.create = (newUser, result) => {
  pool.query("INSERT INTO users SET ?", newUser, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    console.log("created user: ", { id: res.insertId, ...newUser });
    result(null, { id: res.insertId, ...newUser });
  });
};

User.findByUuid = (userUuid, result) => {
  pool.query("SELECT * FROM users WHERE UUID = ?", `${userUuid}`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      console.log("found user: ", res[0]);
      result(null, res[0]);
      return;
    }

    // not found user with the uuid
    console.log(userUuid)
    result({ kind: "not_found" }, null);
  });
};

User.getAll = result => {
  pool.query("SELECT * FROM users", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log("users: ", res);
    result(null, res);
  });
};

User.updateByUuid = (user, result) => {
  pool.query(
    "UPDATE users SET username = ?, fname = ?, lname = ?, phone = ?, password = ?, user_level = ? WHERE UUID = ?",
    [user.username, user.fname, user.lname, user.phone, user.password, user.user_level, user.uuid],
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }

      if (res.affectedRows == 0) {
        // not found user with the uuid
        result({ kind: "not_found" }, null);
        return;
      }

      console.log("updated user: ", { user });
      result(null, { user });
    }
  );
};

User.remove = (user, result) => {
  pool.query("DELETE FROM users WHERE UUID = ?", `${user}`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    if (res.affectedRows == 0) {
      // not found user with the uuid
      result({ kind: "not_found" }, null);
      return;
    }

    console.log("deleted user with uuid: ", user.uuid);
    result(null, res);
  });
};

User.removeAll = result => {
  pool.query("DELETE FROM users", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log(`deleted ${res.affectedRows} users`);
    result(null, res);
  });
};

module.exports = User;
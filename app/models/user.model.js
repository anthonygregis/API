const sql = require("./db.js");

// constructor
const User = function(user) {
  this.username = user.username;
  this.fname = user.fname;
  this.lname = user.lname;
  this.phone = user.phone;
  this.password = user.password;
  this.passphrase = user.passphrase;
  this.user_level = user.user_level;
  this.created_at = user.created_at;
};

User.create = (newUser, result) => {
  sql.query("INSERT INTO users SET ?", newUser, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    console.log("created user: ", { uuid: res.insertUuid, ...newUser });
    result(null, { uuid: res.insertUuid, ...newUser });
  });
};

User.findByUuid = (userId, result) => {
  sql.query(`SELECT * FROM users WHERE UUID = ${userUuid}`, (err, res) => {
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

    // not found user with the id
    result({ kind: "not_found" }, null);
  });
};

User.getAll = result => {
  sql.query("SELECT * FROM users", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log("users: ", res);
    result(null, res);
  });
};

User.updateByUuid = (uuid, user, result) => {
  sql.query(
    "UPDATE users SET username = ?, fname = ?, lname = ?, phone = ?, password = ?, passphrase = ?, user_level = ?, created_at = ?, WHERE UUID = ?",
    [user.username, user.fname, user.lname, user.phone, user.password, user.passphrase, user.user_level, user.created_at],
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

      console.log("updated user: ", { uuid: uuid, ...user });
      result(null, { uuid: uuid, ...user });
    }
  );
};

User.remove = (uuid, result) => {
  sql.query("DELETE FROM users WHERE UUID = ?", uuid, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    if (res.affectedRows == 0) {
      // not found user with the id
      result({ kind: "not_found" }, null);
      return;
    }

    console.log("deleted user with uuid: ", uuid);
    result(null, res);
  });
};

User.removeAll = result => {
  sql.query("DELETE FROM users", (err, res) => {
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
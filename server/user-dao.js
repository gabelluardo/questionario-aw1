"use strict";
/* Data Access Object (DAO) module for accessing users */

const db = require("./db");
const bcrypt = require("bcrypt");

exports.getUserById = (id) => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM users WHERE id=?";
    db.get(sql, [id], (err, row) => {
      if (err) {
        reject(err);
      } else if (row === undefined) {
        resolve({ error: "User not found." });
      } else {
        const user = { id: row.id, email: row.email, username: row.username };
        resolve(user);
      }
    });
  });
};

exports.getUser = (username, password) => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM users WHERE email=?";
    db.get(sql, [username], (err, row) => {
      if (err) {
        reject(err);
      } else if (row === undefined) {
        resolve(false);
      } else {
        const user = { id: row.id, email: row.email, username: row.username };

        bcrypt
          .compare(password, row.hash)
          .then((result) => {
            if (result) {
              resolve(user);
            } else {
              resolve(false);
            }
          })
          .catch((err) => console.log(err));
      }
    });
  });
};

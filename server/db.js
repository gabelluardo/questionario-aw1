"use strict";

const sqlite3 = require("sqlite3");

// open the database
const db = new sqlite3.Database("./survey.db", (err) => {
  if (err) throw err;
});

module.exports = db;

"use strict";

const db = require("./db");

exports.getAllSurvey = () => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM surveys";
    db.all(sql, (err, rows) => (err ? reject(err) : resolve(rows)));
  });
};

exports.createSurvey = (survey, admin) => {
  return new Promise((resolve, reject) => {
    const sql = `INSERT INTO surveys(admin, adminStr, title, reply) VALUES(?, ?, ?, 0);`;
    db.run(sql, [admin.id, admin.username, survey.title], function (err) {
      err ? reject(err) : resolve(this.lastID);
    });
  });
};

// exports.deleteSurvey = (id) => {
//   return new Promise((resolve, reject) => {
//     const sql = "DELETE FROM surveys WHERE id=?";
//     db.run(sql, [id], (err) => (err ? reject(err) : resolve(null)));
//   });
// };

exports.insertQuestions = (questions, id) => {
  return new Promise((resolve, reject) => {
    questions.forEach((q) => {
      const choices = q.choices || [];

      const sql = `INSERT INTO questions(survey_id, text, position, optional, min, max, choice1, choice2, choice3, choice4, choice5, choice6, choice7, choice8, choice9, choice10)
      VALUES(?, ?, ?, ?, ?, ?,?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`;
      db.run(
        sql,
        [id, q.text, q.position, q.optional, q.min, q.max, ...choices],
        (err) => (err ? reject(err) : null)
      );
    });

    resolve(null);
  });
};

"use strict";

const db = require("./db");

exports.getAllSurvey = () => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT id, adminStr, title FROM surveys";
    db.all(sql, (err, rows) => (err ? reject(err) : resolve(rows)));
  });
};

exports.getAllQuestions = (id) => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM questions WHERE survey_id=?";
    db.all(sql, [id], (err, rows) =>
      err
        ? reject(err)
        : resolve(
            rows.map((r) => {
              const { question_id, optional, min, max, text } = r;
              const choices = [
                r.choice1,
                r.choice2,
                r.choice3,
                r.choice4,
                r.choice5,
                r.choice6,
                r.choice7,
                r.choice8,
                r.choice9,
                r.choice10,
              ].filter((c) => c);

              return { question_id, text, optional, min, max, choices };
            })
          )
    );
  });
};

exports.getAllReplies = (id, admin) => {
  return new Promise((resolve, reject) => {
    /* An admin can only view replies from his survey */
    const sql = `SELECT * 
                  FROM    replies AS R, surveys AS S 
                  WHERE   R.survey_id == S.id
                  AND     R.survey_id=? AND S.admin=?`;

    db.all(sql, [id, admin.id], (err, rows) =>
      err
        ? reject(err)
        : resolve(
            rows.map((r) => {
              const { survey_id, question_id, text, user } = r;
              const choices = [
                r.choice1,
                r.choice2,
                r.choice3,
                r.choice4,
                r.choice5,
                r.choice6,
                r.choice7,
                r.choice8,
                r.choice9,
                r.choice10,
              ]
                .filter((c) => c !== null)
                .map(Boolean);

              return { survey_id, question_id, text, user, choices };
            })
          )
    );
  });
};

exports.getAdminSurvey = (admin) => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM surveys WHERE admin=?";
    db.all(sql, [admin.id], (err, rows) => (err ? reject(err) : resolve(rows)));
  });
};

exports.createSurvey = (survey, admin) => {
  return new Promise((resolve, reject) => {
    const sql = `INSERT INTO surveys(admin, adminStr, title, replies) VALUES(?, ?, ?, 0)`;
    db.run(sql, [admin.id, admin.username, survey.title], function (err) {
      err ? reject(err) : resolve(this.lastID);
    });
  });
};

exports.deleteSurvey = (id) => {
  return new Promise((resolve, reject) => {
    const sql = "DELETE FROM surveys WHERE id=?";
    db.run(sql, [id], (err) => (err ? reject(err) : resolve(null)));
  });
};

exports.insertQuestions = (questions, id) => {
  return new Promise((resolve, reject) => {
    const sql = `INSERT INTO questions(survey_id, text,  optional, min, max, choice1, choice2, choice3, choice4, choice5, choice6, choice7, choice8, choice9, choice10)
    VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    const statement = db.prepare(sql, (err) =>
      err ? reject(err) : resolve(true)
    );

    // All rows are inserted in order
    db.serialize(() =>
      questions.forEach((q) => {
        const choices = q.choices || [];
        statement.run(
          [id, q.text, q.optional, q.min, q.max, ...choices],
          (err) => (err ? reject(err) : null)
        );
      })
    );

    statement.finalize();
  });
};

exports.insertReply = (replies) => {
  return new Promise((resolve, reject) => {
    const sql = `INSERT INTO replies(survey_id, question_id, user, text, choice1, choice2, choice3, choice4, choice5, choice6, choice7, choice8, choice9, choice10)
    VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    const statement = db.prepare(sql, (err) => (err ? reject(err) : null));

    db.serialize(() =>
      replies.forEach((r) => {
        const choices = r.choices || [];
        statement.run(
          [r.survey_id, r.question_id, r.user, r.text, ...choices],
          (err) => (err ? reject(err) : null)
        );
      })
    );

    statement.finalize();

    const inc = `UPDATE surveys SET replies = replies + 1 WHERE id=?`;
    db.run(inc, [replies[0].survey_id], (err) =>
      err ? reject(err) : resolve(null)
    );
  });
};

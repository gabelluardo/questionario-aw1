"use strict";

const express = require("express");
const morgan = require("morgan");
const { check, validationResult, body, oneOf } = require("express-validator"); // validation middleware

const surveyDao = require("./survey-dao");
const userDao = require("./user-dao");

/* PASSPORT set up */
const passport = require("passport");
const session = require("express-session");
const LocalStrategy = require("passport-local").Strategy;

passport.use(
  new LocalStrategy(function (username, password, done) {
    userDao.getUser(username, password).then((user) => {
      if (!user)
        return done(null, false, {
          message: "Incorrect username and/or password.",
        });

      return done(null, user);
    });
  })
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  userDao
    .getUserById(id)
    .then((user) => {
      done(null, user);
    })
    .catch((err) => {
      done(err, null);
    });
});

// init express
const app = new express();
const port = 3001;

app.use(morgan("dev"));
app.use(express.json());

// session middleware
const isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) return next();

  return res.status(401).json({ error: "not authenticated" });
};

app.use(
  session({
    secret: "secret sentence not to be shared",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

/*** APIs ***/

app.get("/api/surveys", async (_, res) => {
  try {
    const s = await surveyDao.getAllSurvey();
    res.status(200).json(s);
  } catch (e) {
    console.log(e);
    res.status(503).json({
      msg: "Database error during the retrive of surveys.",
    });
  }
});

// TODO Add validation + Login
app.post("/api/surveys", async (req, res) => {
  // const err = validationResult(req);
  // if (!err.isEmpty()) {
  //   return res.status(422).json({ errors: err.array() });
  // }

  const survey = req.body;
  // const admin = req.user;
  const admin = { id: 1, username: "admin1" };

  try {
    const lastID = await surveyDao.createSurvey(survey, admin);
    await surveyDao.insertQuestions(survey.questions, lastID);

    res.status(200).end();
  } catch (e) {
    console.log(e);
    res.status(503).json({
      error: `Database error during creation of task`,
    });
  }
});

// activate the server
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});

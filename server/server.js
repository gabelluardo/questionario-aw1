"use strict";

const express = require("express");
const morgan = require("morgan");
const { check, validationResult, checkSchema } = require("express-validator"); // validation middleware

const surveyDao = require("./survey-dao");
const userDao = require("./user-dao");

/* PASSPORT set up */
const passport = require("passport");
const session = require("express-session");
const LocalStrategy = require("passport-local").Strategy;

passport.use(
  new LocalStrategy(function (username, password, done) {
    userDao.getUser(username, password).then((user) => {
      if (!user) {
        return done(null, false, {
          message: "Incorrect username or password.",
        });
      }

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
const port = 3001;
const app = new express();

app.use(morgan("dev"));
app.use(express.json());

// session middleware
const isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) return next();

  return res.status(401).json({ err: "not authenticated" });
};

app.use(
  session({
    secret: "secret sentence not to be shared",
    resave: false,
    saveUninitialized: false,
    // NOTE this fix a firefox warning for cookies
    cookie: {
      sameSite: "strict",
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

/*** APIs ***/

app.get("/api/surveys", async (_, res) => {
  try {
    const s = await surveyDao.getAllSurvey();
    res.status(200).json(s);
  } catch {
    res.status(503).json({
      msg: "Database error during the retrive of surveys.",
    });
  }
});

app.get("/api/questions/:id", [check("id").isInt()], async (req, res) => {
  const err = validationResult(req);
  if (!err.isEmpty()) {
    return res.status(422).json({ err: err.array() });
  }

  const id = req.params.id;

  try {
    const q = await surveyDao.getAllQuestions(id);
    const sorted = q.sort((a, b) => a.question_id - b.question_id);

    res.status(200).json(sorted);
  } catch {
    res.status(503).json({
      msg: "Database error during the retrive of questions.",
    });
  }
});

app.get(
  "/api/admin/replies/:survey_id",
  isLoggedIn,
  [check("survey_id").isInt()],
  async (req, res) => {
    const err = validationResult(req);
    if (!err.isEmpty()) {
      return res.status(422).json({ err: err.array() });
    }

    const id = req.params.survey_id;
    const admin = req.user;

    try {
      const q = await surveyDao.getAllReplies(id, admin);
      res.status(200).json(q);
    } catch {
      res.status(503).json({
        msg: "Database error during the retrive of replies.",
      });
    }
  }
);

const repliesSchema = {
  reply: { isArray: true, notEmpty: true },
  "reply.*.question_id": { isInt: true },
  "reply.*.survey_id": { isInt: true },
  "reply.*.user": { isString: true },
  "reply.*.text": {
    isString: true,
    isLength: { min: 1, max: 200 },
    optional: { options: { nullable: true } },
    /* NOTE if there is an array of choices, `text` must be `null` */
    custom: {
      options: (value, { req, path }) => {
        const pos = path.match(/\d+/)[0];
        const c = req.body.reply[pos].choices;

        return !(value && c);
      },
    },
  },
  "reply.*.choices": {
    isArray: true,
    isLength: { min: 1, max: 10 },
    optional: { options: { nullable: true } },
    /* NOTE if there is `text`, `choices` must be `null` */
    custom: {
      options: (value, { req, path }) => {
        const pos = path.match(/\d+/)[0];
        const t = req.body.reply[pos].text;

        return !(value && t);
      },
    },
  },
};

app.post("/api/replies", checkSchema(repliesSchema), async (req, res) => {
  const err = validationResult(req);
  if (!err.isEmpty()) {
    return res.status(422).json({ err: err.array() });
  }

  const reply = req.body.reply;

  try {
    await surveyDao.insertReply(reply);
    res.status(200).end();
  } catch {
    res.status(503).json({
      msg: "Database error during the creation of reply.",
    });
  }
});

app.get("/api/admin/surveys", isLoggedIn, async (req, res) => {
  const admin = req.user;

  try {
    const s = await surveyDao.getAdminSurvey(admin);
    res.status(200).json(s);
  } catch {
    res.status(503).json({
      msg: "Database error during the retrive of surveys.",
    });
  }
});

const surveysSchema = {
  title: { isString: true, notEmpty: true },
  questions: { isArray: true, notEmpty: true },

  "questions.*.text": { isString: true, notEmpty: true },
  "questions.*.optional": {
    isBoolean: true,
    optional: { options: { nullable: true } },
    /* NOTE if there is `choices`, `optional` must be `null` */
    custom: {
      options: (value, { req, path }) => {
        const pos = path.match(/\d+/)[0];
        const c = req.body.questions[pos].choices;
        const v = value !== null;

        return !(v && c);
      },
    },
  },
  "questions.*.min": {
    isInt: true,
    optional: { options: { nullable: true } },
  },
  "questions.*.max": {
    isInt: true,
    optional: { options: { nullable: true } },
  },
  "questions.*.choices": {
    isArray: true,
    isLength: { min: 1, max: 10 },
    optional: { options: { nullable: true } },
    /* NOTE if there is `optional`, `choices` must be `null` */
    custom: {
      options: (value, { req, path }) => {
        const pos = path.match(/\d+/)[0];
        const opt = req.body.questions[pos].optional;
        const o = opt !== null && opt !== undefined;

        return !(value && o);
      },
    },
  },
};

app.post(
  "/api/admin/surveys",
  isLoggedIn,
  checkSchema(surveysSchema),
  async (req, res) => {
    const err = validationResult(req);
    if (!err.isEmpty()) {
      return res.status(422).json({ err: err.array() });
    }

    const survey = req.body;
    const admin = req.user;

    try {
      const lastID = await surveyDao.createSurvey(survey, admin);
      const ok = await surveyDao
        .insertQuestions(survey.questions, lastID)
        // Rollback
        .catch(() => {
          surveyDao.deleteSurvey(lastID);
        });

      if (ok) {
        res.status(200).end();
      } else {
        throw ok;
      }
    } catch {
      res.status(503).json({
        error: `Database error during the creation of survey.`,
      });
    }
  }
);

/*** Users APIs ***/

/* login */
app.post("/api/sessions", function (req, res, next) {
  passport.authenticate("local", (err, user, info) => {
    if (err) return next(err);
    if (!user) {
      return res.status(401).json(info);
    }
    req.login(user, (err) => {
      if (err) return next(err);

      return res.json(req.user);
    });
  })(req, res, next);
});

/* logout */
app.delete("/api/sessions/current", (req, res) => {
  req.logout();
  res.end();
});

/* check whether the user is logged in or not */
app.get("/api/sessions/current", (req, res) => {
  if (req.isAuthenticated()) {
    res.status(200).json(req.user);
  } else res.status(401).json({ error: "Unauthenticated user!" });
});

// activate the server
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});

import { useState, useEffect } from "react";

import { Container } from "react-bootstrap";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import { Navbar, Dashboard, Login, Editor } from "./components";
import * as API from "./API";

function App() {
  const [surveyList, setSurveyList] = useState([]);
  const [newSurvey, setNewSurvey] = useState({});
  const [admin, setAdmin] = useState(null);
  const [dirty, setDirty] = useState(true);

  // User info if already logged in
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Due to httpOnly cookie, this request
        // will always fail on first access
        const user = await API.getUserInfo();
        setAdmin(user);
      } catch (err) {
        console.log(err);
      }
    };

    checkAuth()
      .then(() => setDirty(true))
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    async function getSurveys() {
      if (admin) {
        const as = await API.getAdminSurveys();
        setSurveyList(as);
      } else {
        const s = await API.getAllSurveys();
        setSurveyList(s);
      }
    }

    if (dirty) {
      getSurveys().then(setDirty(false));
    }
  }, [dirty, admin]);

  const createSurvey = (s) => {
    API.createSurvey(s)
      .then(setDirty(true))
      .catch((err) => console.log(err));
  };

  const handleLogin = async (credentials) => {
    try {
      const admin = await API.logIn(credentials);
      setAdmin(admin);
      setDirty(true);
      return true;
    } catch (e) {
      return { err: e };
    }
  };

  const handleLogout = () => {
    API.logOut()
      .then(() => {
        setAdmin(null);
        setDirty(true);
      })
      .catch((err) => console.log(err));
  };

  return (
    <Router>
      <Navbar user={admin} logout={handleLogout} />
      <Container>
        <Switch>
          <Route
            path="/login"
            render={(props) => <Login {...props} login={handleLogin} />}
          />

          <Route
            path="/editor"
            render={(props) => (
              <Editor
                {...props}
                survey={newSurvey}
                user={admin}
                create={createSurvey}
              />
            )}
          />

          <Route
            path="/"
            render={(props) => (
              <Dashboard
                {...props}
                list={surveyList}
                user={admin}
                handleCreate={(t) => setNewSurvey(t)}
              />
            )}
          />
        </Switch>
      </Container>
    </Router>
  );
}

export default App;

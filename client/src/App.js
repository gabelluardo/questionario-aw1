import { useState, useEffect } from "react";

import { Container } from "react-bootstrap";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import { Navbar, Dashboard, Login, Survey } from "./components";
import * as API from "./API";

// TODO delete example
const userExample = {
  id: 1,
  username: "admin1",
  email: "admin1@polito.it",
};

function App() {
  const [surveyList, setSurveyList] = useState([]);
  const [newSurvey, setNewSurvey] = useState({});
  const [user, _setUser] = useState(userExample);
  const [dirty, setDirty] = useState(true);

  useEffect(() => {
    async function getSurveys() {
      const s = await API.getAllSurveys();
      setSurveyList(s);
    }

    if (dirty) {
      getSurveys().then(setDirty(false));
    }
  }, [dirty]);

  const createSurvey = (s) => {
    API.createSurvey(s)
      .then(setDirty(true))
      .catch((err) => console.log(err));
  };

  const initNewSurvey = (t) => {
    setNewSurvey(t);
  };

  const handleLogin = (c) => {
    console.log(c);
  };

  return (
    <Router>
      <Navbar user={user} />
      <Container>
        <Switch>
          <Route
            path="/login"
            render={(props) => <Login {...props} login={handleLogin} />}
          />

          <Route
            path="/survey"
            render={(props) => (
              <Survey
                {...props}
                survey={newSurvey}
                user={user}
                create={createSurvey}
              />
            )}
          />

          <Route
            path="/"
            render={(props) => (
              <Dashboard
                {...props}
                surveyList={surveyList.filter((s) => s.admin === user.id)}
                handleCreate={initNewSurvey}
              />
            )}
          />
        </Switch>
      </Container>
    </Router>
  );
}

export default App;

import { useState } from "react";

import { Container } from "react-bootstrap";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import { Navbar, Dashboard, Login, Survey } from "./components";

// TODO delete example
const surveyListExample = [
  {
    title: "Prova questionario 1",
    id: 1,
    response: 25,
    admin: "admin1",
  },
  {
    title: "Prova questionario 2",
    id: 2,
    response: 15,
    admin: "admin2",
  },
  {
    title: "Prova questionario 3",
    id: 3,
    response: 6,
    admin: "admin1",
  },
  {
    title: "Prova questionario 4",
    id: 3,
    response: 0,
    admin: "admin1",
  },
  {
    title: "Prova questionario 5",
    id: 3,
    response: 1,
    admin: "admin1",
  },
];
const userExample = {
  id: 1,
  username: "admin1",
  email: "admin1@polito.it",
};

function App() {
  const [surveyList, _setSurveyList] = useState(surveyListExample);
  const [newSurvey, setNewSurvey] = useState({});
  const [user, _setUser] = useState(userExample);

  const createSurvey = (s) => {
    setNewSurvey(s);
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
            render={(props) => <Survey {...props} survey={newSurvey} />}
          />

          <Route
            path="/"
            render={(props) => (
              <Dashboard
                {...props}
                surveyList={surveyList.filter((s) => s.admin === user.username)}
                handleCreate={createSurvey}
              />
            )}
          />
        </Switch>
      </Container>
    </Router>
  );
}

export default App;

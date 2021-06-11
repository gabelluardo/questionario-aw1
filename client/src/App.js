import { useState } from "react";

import { Container, Row } from "react-bootstrap";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import { Navbar, Sidebar, View, Login } from "./components";

function App() {
  const [show, setShow] = useState(false);
  const [user, setUser] = useState({
    id: 1,
    username: "admin1",
    email: "admin1@polito.it",
  });

  const createSurvey = () => {
    console.log("create survey");
  };

  return (
    <Router>
      <Container fluid>
        <Row className="vheight-100">
          <Navbar user={user} toggle={() => setShow(!show)} />
          <Sidebar show={show} />
          <Switch>
            <Route
              path="/login"
              render={(props) => (
                <Login {...props} login={(c) => console.log(c)} />
              )}
            />

            {/* <Route path="/survey" render={(props) => <Survey {...props} />} /> */}

            <Route
              path="/"
              render={(props) => (
                <View
                  {...props}
                  title="Dashboard"
                  createSurvey={createSurvey}
                />
              )}
            />
          </Switch>
        </Row>
      </Container>
    </Router>
  );
}

export default App;

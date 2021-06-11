import { useState } from "react";

import { Container, Row } from "react-bootstrap";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import { Navbar, Sidebar, View, Login } from "./components";

function App() {
  const [show, setShow] = useState(false);

  const createSurvey = () => {
    console.log("create survey");
  };

  return (
    <Router>
      <Container fluid>
        <Row className="vheight-100">
          <Navbar toggle={() => setShow(!show)} />
          <Sidebar show={show} />
          <Switch>
            <Route path="/login" render={(props) => <Login {...props} />} />

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

import { useState } from "react";

import { Container, Row } from "react-bootstrap";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import { Navbar, Sidebar, View } from "./components";

function App() {
  const [show, setShow] = useState(false);

  return (
    <div className="App">
      <Router>
        <Navbar toggle={() => setShow(!show)} />
        <Container fluid>
          <Row className="vheight-100">
            <Sidebar show={show} />
            <Switch>
              <Route path="/" component={View} />
            </Switch>
          </Row>
        </Container>
      </Router>
    </div>
  );
}

export default App;

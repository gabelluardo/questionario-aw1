import { useState } from "react";
import { Button, Col, Row, Form } from "react-bootstrap";
import * as Icon from "react-bootstrap-icons";

// TODO Validation, submit, redirect to "/"
function Login(props) {
  const [email, setEmail] = useState("admin1@polito.it");
  const [password, setPassword] = useState("passadmin1");
  const [error, setError] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    const credentials = { email: email, password: password };
    let valid = true;
    if (email === "" || password === "" || password.length < 6) {
      valid = false;
      setError(true);
      setTimeout(() => setError(false), 3000);
    }

    if (valid) {
      props.login(credentials);
      props.history.push("/");
    }
  };

  return (
    <Col className="view py-5 px-auto">
      <Row className="justify-content-center">
        <Form className="px-5 pt-2 login-form" onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(ev) => setEmail(ev.target.value)}
            />
            {!error ? null : (
              <Form.Text className="text-danger font-weight-bold">
                <Icon.XOctagonFill className="mr-2 ml-1" />
                Wrong email or password
              </Form.Text>
            )}
          </Form.Group>{" "}
          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Password"
              value={password}
              onChange={(ev) => setPassword(ev.target.value)}
            />
          </Form.Group>
          <Button variant="primary" type="submit">
            Submit
          </Button>
        </Form>
      </Row>
    </Col>
  );
}

export default Login;

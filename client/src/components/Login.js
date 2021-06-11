import { useState } from "react";
import { Button, Col, Form } from "react-bootstrap";

function Login(props) {
  const [email, setEmail] = useState("admin1@polito.it");
  const [password, setPassword] = useState("passadmin1");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <Col className="view py-5 px-auto" sm={12} lg={9} md={8}>
      {/* <Card.Body> */}
      <Form className="px-5" onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(ev) => setEmail(ev.target.value)}
          />
          <Form.Text className="text-muted">
            We'll never share your email with anyone else.
          </Form.Text>
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Password"
            value={password}
            onChange={(ev) => setPassword(ev.target.value)}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicCheckbox">
          <Form.Check type="checkbox" label="Check me out" />
        </Form.Group>
        <Button variant="primary" type="submit">
          Submit
        </Button>
      </Form>
      {/* </Card.Body> */}
    </Col>
  );
}

export default Login;

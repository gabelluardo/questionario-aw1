import { useState } from "react";
import {
  Button,
  Col,
  Row,
  Form,
  Card,
  InputGroup,
  Alert,
} from "react-bootstrap";
import * as Icon from "react-bootstrap-icons";

function Login(props) {
  // NOTE Valid default credentials for easy testing
  const [email, setEmail] = useState("admin1@polito.it");
  const [password, setPassword] = useState("passadmin1");
  const [passwordShown, setPasswordShown] = useState(false);
  const [invalid, setInvalid] = useState(false);
  const [fail, setFail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const credentials = { username: email, password: password };
    let valid = true;
    if (
      email === "" ||
      password === "" ||
      password.length < 6 ||
      !email.includes("@")
    ) {
      valid = false;
      setInvalid(true);
    }

    if (valid) {
      const result = await props.login(credentials);
      if (!result.err) {
        props.history.push("/");
      } else {
        setFail(result.err);
        // NOTE do not delete password, for easy testing
        // setPassword("");
      }
    }
  };

  return (
    <Row className="vheight-100">
      <Col className="px-5 py-4 mt-5">
        <Row className="mx-auto">
          <h1 className="view-title my-auto mr-auto">
            <b>Login</b>
          </h1>
        </Row>
        <Row className="align-items-center">
          <Col lg={6} md={10} className="mx-auto pt-4">
            <Card>
              <Card.Body>
                {!fail ? null : (
                  <Alert
                    dismissible
                    className=" text-center"
                    variant="danger"
                    onClose={() => setFail(null)}
                  >
                    {fail}
                  </Alert>
                )}
                <Form className="px-5 pt-2" onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control
                      type="email"
                      placeholder="Enter email"
                      value={email}
                      onChange={(ev) => setEmail(ev.target.value)}
                    />
                    {!invalid ? null : (
                      <Form.Text className="text-danger font-weight-bold">
                        <Icon.XOctagonFill className="mr-2 ml-1" />
                        Insert valid email and password
                      </Form.Text>
                    )}
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Password</Form.Label>
                    <InputGroup className="mb-2">
                      <Form.Control
                        type={passwordShown ? "text" : "password"}
                        placeholder="Password"
                        value={password}
                        onChange={(ev) => setPassword(ev.target.value)}
                      />
                      <InputGroup.Append>
                        <InputGroup.Text
                          className="icon-action"
                          onClick={() => setPasswordShown(!passwordShown)}
                        >
                          <EyeIcon show={passwordShown} />
                        </InputGroup.Text>
                      </InputGroup.Append>
                    </InputGroup>
                  </Form.Group>
                  <Button variant="primary" type="submit">
                    Submit
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Col>
    </Row>
  );
}

function EyeIcon(props) {
  return props.show ? <Icon.EyeSlash /> : <Icon.Eye />;
}

export default Login;

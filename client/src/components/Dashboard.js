import { useState } from "react";
import {
  Col,
  Card,
  Button,
  Row,
  Modal,
  Form,
  ListGroup,
} from "react-bootstrap";
import { Link } from "react-router-dom";

function Dashboard(props) {
  const [open, setOpen] = useState(false);

  return (
    <Row className="vheight-100">
      <Col className="px-5 py-5">
        <Row className="mx-auto">
          <h1 className="view-title my-auto mr-auto">
            <b>Dashboard</b>
          </h1>
          {!props.user ? null : (
            <>
              <Button
                onClick={() => setOpen(true)}
                variant="green"
                className="my-auto ml-auto mr-3 p-1"
              >
                Create Survey
              </Button>
              <CreateModal
                show={open}
                setClose={() => setOpen(false)}
                {...props}
              />
            </>
          )}
        </Row>

        <Row className="justify-content-center py-5">
          <Col sm={10}>
            <Card className="my-3">
              <Card.Header as="h4">
                {props.user ? "My" : "All"} Surveys
              </Card.Header>
              <Card.Body>
                <Card.Text className="text-muted">
                  These are {props.user ? "the results for your" : "all the"}{" "}
                  published surveys
                </Card.Text>
                <ListGroup variant="flush">
                  {props.list.map((s, k) => (
                    <SurveyListItem
                      key={k}
                      survey={s}
                      results={props.user}
                      {...props}
                    />
                  ))}
                </ListGroup>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Col>
    </Row>
  );
}

function SurveyListItem(props) {
  const { adminStr, title, replies } = props.survey;

  return (
    <ListGroup.Item className="d-flex justify-content-center align-items-center">
      <span className="badge badge-secondary mr-auto">{adminStr}</span>
      <Link
        className={props.results ? "mx-auto" : "mr-auto"}
        to="/survey"
        onClick={() => props.handleSelect(props.survey)}
      >
        {title}
      </Link>
      {!props.results ? null : (
        <span className="badge badge-info ml-auto">{replies}</span>
      )}
    </ListGroup.Item>
  );
}

function CreateModal(props) {
  const [title, setTitle] = useState("");
  const [validated, setValidated] = useState(false);

  const handleSubmit = (e) => {
    const form = e.currentTarget;
    e.preventDefault();
    e.stopPropagation();
    setValidated(true);

    if (form.checkValidity()) {
      const survey = { title: title, questions: [] };

      props.handleCreate(survey);
      props.history.push("/editor");
    }
  };

  const handleClose = () => {
    props.setClose();
    setValidated(false);
  };

  return (
    <Modal animation={false} show={props.show} onHide={handleClose}>
      <Form noValidate validated={validated} onSubmit={handleSubmit}>
        <Modal.Header closeButton>
          <Modal.Title>Create new survey</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Survey Title</Form.Label>
            <Form.Control
              required
              type="text"
              placeholder="Enter Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <Form.Control.Feedback type="invalid">
              Title is required!
            </Form.Control.Feedback>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="success" type="submit">
            Create
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}

export default Dashboard;

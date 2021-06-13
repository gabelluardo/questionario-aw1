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
// import * as Icon from "react-bootstrap-icons";

function Dashboard(props) {
  const [open, setOpen] = useState(false);

  return (
    <Row className="vheight-100">
      <Col className="px-5 py-4 mt-5">
        {/* Title */}
        <Row className="mx-auto">
          <h1 className="view-title my-auto mr-auto">
            <b>Dashboard</b>
          </h1>
          <Button
            onClick={() => setOpen(true)}
            variant="green"
            className="my-auto ml-auto mr-3 p-1"
          >
            Create Survey
          </Button>
          <CreateModal show={open} setClose={() => setOpen(false)} {...props} />
        </Row>

        {/* Action Card */}
        <Row className="justify-content-center py-5">
          <Col sm={6}>
            <Card className="my-3">
              <Card.Header as="h4">My Surveys</Card.Header>
              <Card.Body>
                <Card.Text className="text-muted">
                  These are your published surveys
                </Card.Text>
                <ListGroup variant="flush">
                  {props.surveyList.map((s, k) => (
                    <SurveyListItem key={k} {...s} {...props} />
                  ))}
                </ListGroup>
              </Card.Body>
            </Card>
          </Col>
          <Col sm={6}>
            <Card className="my-3">
              <Card.Header as="h4">My Results</Card.Header>
              <Card.Body>
                <Card.Text className="text-muted">
                  These are results for your surveys
                </Card.Text>
                <ListGroup variant="flush">
                  {props.surveyList
                    .filter((s) => s.reply)
                    .map((s, k) => (
                      <SurveyListItem key={k} {...s} {...props} results />
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

function CreateModal(props) {
  const [title, setTitle] = useState("");
  const [validated, setValidated] = useState(false);

  const handleSubmit = (e) => {
    const form = e.currentTarget;
    e.preventDefault();
    e.stopPropagation();
    setValidated(true);

    if (form.checkValidity()) {
      // TODO Create survey and redirect to "/survey"
      const survey = { title: title, questions: [] };

      props.handleCreate(survey);
      handleClose();
      props.history.push("/survey");
    }
  };

  const handleClose = () => {
    props.setClose();
    setTitle("");
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

function SurveyListItem(props) {
  return (
    <ListGroup.Item className="d-flex justify-content-between align-items-center">
      <span className="badge badge-secondary mr-auto">{props.adminStr}</span>
      <span className="mr-auto">{props.title}</span>
      {!props.results ? null : (
        <span className="badge badge-info mx-auto ">{props.reply}</span>
      )}
    </ListGroup.Item>
  );
}

export default Dashboard;

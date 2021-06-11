import { useState } from "react";
import { Col, Card, Button, Row, Modal, Form } from "react-bootstrap";

function View(props) {
  const [open, setOpen] = useState(false);

  return (
    <Col lg={9} md={8} className="view p-4">
      <Row className="view-title mx-1">
        <h1 className="my-auto mr-auto">
          <b>{props.title}</b>
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
      <Row className="align-items-center">
        <Col sm={6}>
          <Card className="my-3">
            <Card.Header>Featured</Card.Header>
            <Card.Body>
              <Card.Title>Special title treatment</Card.Title>
              <Card.Text>
                With supporting text below as a natural lead-in to additional
                content.
              </Card.Text>
              <Button variant="primary">Go somewhere</Button>
            </Card.Body>
          </Card>
        </Col>
        <Col sm={6}>
          <Card className="my-3">
            <Card.Header>Featured</Card.Header>
            <Card.Body>
              <Card.Title>Special title treatment</Card.Title>
              <Card.Text>
                With supporting text below as a natural lead-in to additional
                content.
              </Card.Text>
              <Button variant="primary">Go somewhere</Button>
            </Card.Body>
          </Card>
        </Col>
        <Col sm={6}>
          <Card className="my-3">
            <Card.Header>Featured</Card.Header>
            <Card.Body>
              <Card.Title>Special title treatment</Card.Title>
              <Card.Text>
                With supporting text below as a natural lead-in to additional
                content.
              </Card.Text>
              <Button variant="primary">Go somewhere</Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Col>
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
      console.log(title);
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
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            ></Form.Control>
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

export default View;

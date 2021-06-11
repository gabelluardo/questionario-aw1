import { Col, Card, Button, Row } from "react-bootstrap";

function View(props) {
  return (
    <Col lg={9} md={8} className="view p-4">
      <Row className="view-title mx-1">
        <h1 className="my-auto mr-auto">
          <b>{props.title}</b>
        </h1>
        <Button
          onClick={() => props.createSurvey()}
          variant="green"
          className="my-auto ml-auto mr-3 p-1"
        >
          Create Survey
        </Button>
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

export default View;

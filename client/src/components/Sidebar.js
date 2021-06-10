import { ListGroup, Collapse, Col } from "react-bootstrap";
import * as Icon from "react-bootstrap-icons";
import { Link } from "react-router-dom";

function Sidebar(props) {
  return (
    <Collapse in={props.show}>
      <Col sm={4} className="d-sm-block bg-light below-nav no-hover p-4">
        <ListGroup variant="flush">
          <ListGroup.Item as={Link} to="/" action>
            <Icon.Book size={32} className="mx-2" />
            Dashboard
          </ListGroup.Item>
          <ListGroup.Item as={Link} to="/important" action>
            Important
          </ListGroup.Item>
          <ListGroup.Item as={Link} to="/today" action>
            Today
          </ListGroup.Item>
          <ListGroup.Item as={Link} to="/next-7-days" action>
            Next 7 Days
          </ListGroup.Item>
          <ListGroup.Item as={Link} to="/private" action>
            Private
          </ListGroup.Item>
        </ListGroup>
      </Col>
    </Collapse>
  );
}

export default Sidebar;

import { ListGroup, Collapse, Col } from "react-bootstrap";
import * as Icon from "react-bootstrap-icons";
import { Link } from "react-router-dom";

function Sidebar(props) {
  return (
    <Collapse in={props.show}>
      <Col lg={3} md={4} className="d-md-block no-hover p-4 sidebar-router">
        <ListGroup>
          <ListGroup.Item as={Link} to="/" action>
            <Icon.Book size={24} className="mr-2" />
            Dashboard
          </ListGroup.Item>
          <ListGroup.Item as={Link} to="/important" action>
            Drafts
          </ListGroup.Item>
          <ListGroup.Item as={Link} to="/today" action>
            Results
          </ListGroup.Item>
        </ListGroup>
      </Col>
    </Collapse>
  );
}

export default Sidebar;

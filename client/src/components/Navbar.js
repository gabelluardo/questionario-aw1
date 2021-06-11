import { useState, useRef, useEffect } from "react";

import { Navbar as BNavbar, Card, ListGroup } from "react-bootstrap";
import * as Icon from "react-bootstrap-icons";
import { Link } from "react-router-dom";

function Navbar(props) {
  const [show, setShow] = useState(false);

  return (
    <BNavbar
      collapseOnSelect
      bg="blue"
      expand="md"
      fixed="top"
      className="sidebar-profile"
    >
      <BNavbar.Toggle onClick={props.toggle} label="Toggle navigation" />

      <BNavbar.Brand as={Link} to="/" className="my-auto ml-auto ml-md-0">
        <Icon.PatchQuestionFill className="mr-2" size={32} />
        Survey Manager
      </BNavbar.Brand>

      <BNavbar.Brand className="my-auto ml-auto">
        <Icon.PersonSquare size={32} onClick={() => setShow(!show)} />
        <Profile
          show={show}
          setShow={setShow}
          // TODO update user props
          username="admin"
          email="admin@polito.it"
          isLogged={false}
        />
      </BNavbar.Brand>
    </BNavbar>
  );
}

function Profile(props) {
  const ref = useRef();
  useOnClickOutside(ref, () => props.setShow(false));

  return !props.show ? null : (
    <Card ref={ref} className="profile-settings">
      <Card.Header as="h6">
        <Card.Title>
          <Icon.PersonCircle size={24} />
          <span className="ml-2">{props.username}</span>
        </Card.Title>
        <Card.Subtitle className="text-muted">{props.email}</Card.Subtitle>
      </Card.Header>
      <ListGroup variant="flush" onClick={() => props.setShow(false)}>
        <ListGroup.Item
          action
          as={Link}
          to={props.isLogged ? "/logout" : "/login"}
        >
          {props.isLogged ? (
            <Icon.BoxArrowRight size={20} className="mr-2" />
          ) : (
            <Icon.BoxArrowInRight size={20} className="mr-2" />
          )}
          <span>{props.isLogged ? "Logout" : "Login"}</span>
        </ListGroup.Item>
      </ListGroup>
    </Card>
  );
}

// Custom Hook
function useOnClickOutside(ref, handler) {
  useEffect(() => {
    const listener = (event) => {
      const el = ref?.current;

      if (!el || el.contains(event.target)) {
        return;
      }

      handler(event);
    };

    document.addEventListener(`mousedown`, listener);
    document.addEventListener(`touchstart`, listener);

    return () => {
      document.removeEventListener(`mousedown`, listener);
      document.removeEventListener(`touchstart`, listener);
    };

    // Reload only if ref or handler changes
  }, [ref, handler]);
}

export default Navbar;

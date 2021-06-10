import { Col, Row, Navbar as BNavbar } from "react-bootstrap";
import * as Icon from "react-bootstrap-icons";

function Navbar(props) {
  return (
    <BNavbar
      collapseOnSelect
      bg="success"
      expand="sm"
      fixed="top"
      className="sidebar-profile"
    >
      <BNavbar.Toggle onClick={props.toggle} label="Toggle navigation" />

      <BNavbar.Brand className="my-auto ml-auto ml-sm-0">
        <Icon.PatchQuestionFill className="mr-2" size={24} />
        Survey Manager
      </BNavbar.Brand>

      <BNavbar.Brand className="my-auto ml-auto">
        {/* TODO: Aggiungere component per fare logout e vedere username/email/foto */}
        <Icon.PersonSquare size={24} />
      </BNavbar.Brand>
    </BNavbar>
  );
}

export default Navbar;

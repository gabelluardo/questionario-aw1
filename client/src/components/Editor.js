import { useState } from "react";
import {
  Button,
  Col,
  Form,
  Row,
  Dropdown,
  DropdownButton,
} from "react-bootstrap";
import * as Icon from "react-bootstrap-icons";

function Editor(props) {
  const [title, setTitle] = useState(props.survey.title || "");
  const [questions, setQuestions] = useState(props.survey.questions || []);

  // TODO add validation
  const handleSubmit = (e) => {
    e.preventDefault();

    const survey = { title: title, questions: questions };
    console.log(survey);

    props.create(survey);
    props.history.push("/");
  };

  const handleNewQuestion = (multipleChoice) => {
    if (multipleChoice) {
      const question = {
        text: "",
        optional: false,
      };
      setQuestions((q) => [...q, question]);
    } else {
      const question = {
        text: "",
        min: 0,
        max: 1,
        choices: [],
      };
      setQuestions((q) => [...q, question]);
    }
  };

  const handleChange = (value, key, type, choiceKey = null) => {
    if (choiceKey == null) {
      questions[key][type] = value;
    } else {
      questions[key][type][choiceKey] = value;
    }

    setQuestions([...questions]);
  };

  const handleDelete = (id, choiceKey = null) => {
    let q = questions;
    if (choiceKey == null) {
      q = q.filter((_, k) => k !== id);
    } else {
      q[id].choices = q[id].choices.filter((_, k) => k !== choiceKey);
    }
    setQuestions([...q]);
  };

  const handleChangePosition = (oldPos, newPos) => {
    const q = questions;
    [q[oldPos], q[newPos]] = [q[newPos], q[oldPos]];
    setQuestions([...q]);
  };

  const handleAddChoice = (id) => {
    const q = questions;
    if (q[id].choices.length < 10) {
      q[id].choices.push("");
      setQuestions([...q]);
    }
  };

  return (
    <Row className="vheight-100">
      <Col className="px-5 py-4 mt-5">
        <Row className="mx-auto">
          <h1 className="view-title">
            <b>Survey editor</b>
          </h1>
          <DropdownButton
            className="my-auto ml-auto mr-3 p-1"
            title="New Question"
            variant="green"
          >
            <Dropdown.Item
              as={Button}
              variant="outline-light"
              onClick={() => handleNewQuestion(true)}
            >
              Open-ended
            </Dropdown.Item>
            <Dropdown.Item
              as={Button}
              variant="outline-light"
              onClick={() => handleNewQuestion(false)}
            >
              Multiple choice
            </Dropdown.Item>
          </DropdownButton>
        </Row>
        <Row className="align-items-center">
          <Col sm={10} className="mt-4 mx-auto">
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label as="h4">Title</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
                <Form.Control.Feedback type="invalid">
                  Title is required!
                </Form.Control.Feedback>
              </Form.Group>

              {questions.map((q, k) => (
                <Question
                  {...q}
                  key={k}
                  id={k}
                  change={handleChange}
                  delete={handleDelete}
                  position={handleChangePosition}
                  addChoice={handleAddChoice}
                  // porps for arrow view
                  last={k === questions.length - 1}
                  first={k === 0}
                />
              ))}

              <hr />
              <Row className="d-flex justify-content-end pt-2">
                <Button
                  className="mr-2"
                  variant="secondary"
                  onClick={() => props.history.push("/")}
                >
                  Cancel
                </Button>
                <Button className="mx-3" variant="success" type="submit">
                  Publish
                </Button>
              </Row>
            </Form>
          </Col>
        </Row>
      </Col>
    </Row>
  );
}

function Question(props) {
  const openedType = (
    <Row>
      <Col sm={8}>
        <Form.Label>Text</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter Question Text"
          value={props.text}
          onChange={(ev) => props.change(ev.target.value, props.id, "text")}
        />
      </Col>
      <Col>
        <Form.Label>Optional</Form.Label>
        <Form.Check
          type="checkbox"
          className="mt-2"
          label={props.optional?.toString()}
          checked={props.optional}
          onChange={() => props.change(!props.optional, props.id, "optional")}
        />
      </Col>
    </Row>
  );

  const closedType = (
    <>
      <Row>
        <Col sm={8}>
          <Form.Label>Text</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter Question Text"
            value={props.text}
            onChange={(e) => props.change(e.target.value, props.id, "text")}
          />
        </Col>
        <Col>
          <Form.Label>Max</Form.Label>
          <Form.Control
            type="number"
            value={props.max}
            min={props.min}
            max={10}
            onChange={(e) =>
              props.change(parseInt(e.target.value), props.id, "max")
            }
          />
        </Col>
        <Col>
          <Form.Label>Min</Form.Label>
          <Form.Control
            type="number"
            value={props.min}
            min={0}
            max={props.max}
            onChange={(e) =>
              props.change(parseInt(e.target.value), props.id, "min")
            }
          />
        </Col>
      </Row>
      <Row className="mt-3">
        <Col>
          <Form.Label className="pb-2">
            Choices
            <Icon.PlusSquare
              size={20}
              className="ml-2 icon-action"
              onClick={() => props.addChoice(props.id)}
            />
          </Form.Label>
          {props.choices?.map((c, k) => (
            <Row key={k}>
              <Col sm={5}>
                <Form.Control
                  className="mb-3"
                  type="text"
                  placeholder={`Enter Choice ${k + 1}`}
                  value={c}
                  onChange={(e) =>
                    props.change(e.target.value, props.id, "choices", k)
                  }
                />
              </Col>
              <Icon.Trash
                size={18}
                className="mt-2 ml-2 icon-action"
                onClick={() => props.delete(props.id, k)}
              />
            </Row>
          ))}
        </Col>
      </Row>
    </>
  );

  return (
    <Form.Group className="my-4">
      <hr />

      <Form.Label as="h4">
        Question {props.id + 1}
        <span className="ml-3">
          {props.last ? null : (
            <Icon.ChevronDoubleDown
              size={16}
              className="mr-1 icon-action"
              onClick={() => props.position(props.id, props.id + 1)}
            />
          )}
          {props.first ? null : (
            <Icon.ChevronDoubleUp
              size={16}
              className="mr-1 icon-action"
              onClick={() => props.position(props.id, props.id - 1)}
            />
          )}
          <Icon.Trash
            size={16}
            className="mr-1 icon-action"
            onClick={() => props.delete(props.id)}
          />
        </span>
      </Form.Label>
      {props.choices ? closedType : openedType}
    </Form.Group>
  );
}

export default Editor;

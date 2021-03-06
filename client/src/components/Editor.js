import { useState, useEffect } from "react";
import {
  Alert,
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

  const [validated, setValidated] = useState(false);
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    setValidated(false);
  }, [questions.length]);

  const handleSubmit = async (e) => {
    const form = e.currentTarget;
    e.preventDefault();
    e.stopPropagation();

    if (!questions.length) {
      setAlert("Insert at least one question");
      setValidated(false);
      return;
    }

    if (form.checkValidity()) {
      const survey = { title: title, questions: questions };

      const res = await props.create(survey);
      if (!res.err) {
        return props.history.push("/");
      } else {
        setAlert(res.err);
      }
    }

    setValidated(true);
  };

  const handleNewQuestion = (multipleChoice) => {
    const opened = {
      text: "",
      optional: false,
    };
    const closed = {
      text: "",
      min: 0,
      max: 1,
      choices: [""],
    };
    const question = multipleChoice ? closed : opened;
    setQuestions((q) => [...q, question]);
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
      <Col className="p-5">
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
              onClick={() => handleNewQuestion(false)}
            >
              Open ended
            </Dropdown.Item>
            <Dropdown.Item
              as={Button}
              variant="outline-light"
              onClick={() => handleNewQuestion(true)}
            >
              Multiple choice
            </Dropdown.Item>
          </DropdownButton>
        </Row>
        <Row className="align-items-center">
          <Col sm={10} className="mt-4 mx-auto">
            {!alert ? null : (
              <Alert
                dismissible
                className="text-center"
                variant="danger"
                onClose={() => setAlert(null)}
              >
                {alert}
              </Alert>
            )}

            <Form noValidate validated={validated} onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label as="h4">Title</Form.Label>
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

              {questions.map((q, k) => (
                <Question
                  {...q}
                  key={k}
                  id={k}
                  change={handleChange}
                  delete={handleDelete}
                  position={handleChangePosition}
                  addChoice={handleAddChoice}
                  // props for arrow view
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
      {props.choices ? <MultipleChoice {...props} /> : <OpenEnded {...props} />}
    </Form.Group>
  );
}

function OpenEnded(props) {
  return (
    <Row>
      <Col sm={8}>
        <Form.Label>Text</Form.Label>
        <Form.Control
          required
          type="text"
          placeholder="Enter Question Text"
          value={props.text}
          onChange={(ev) => props.change(ev.target.value, props.id, "text")}
        />
        <Form.Control.Feedback type="invalid">
          Text is required!
        </Form.Control.Feedback>
      </Col>
      <Col>
        <Form.Label>Optional</Form.Label>
        <Form.Check
          custom
          id={`custom-${props.id}`}
          type="checkbox"
          className="mt-2"
          label={props.optional?.toString()}
          checked={props.optional}
          onChange={() => props.change(!props.optional, props.id, "optional")}
        />
      </Col>
    </Row>
  );
}

function MultipleChoice(props) {
  return (
    <>
      <Row>
        <Col sm={8}>
          <Form.Label>Text</Form.Label>
          <Form.Control
            required
            type="text"
            placeholder="Enter Question Text"
            value={props.text}
            onChange={(e) => props.change(e.target.value, props.id, "text")}
          />
          <Form.Control.Feedback type="invalid">
            Text is required!
          </Form.Control.Feedback>
        </Col>
        <Col>
          <Form.Label>Max</Form.Label>
          <Form.Control
            type="number"
            value={props.max}
            min={props.min || 1}
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
            {props.choices?.length >= 10 ? null : (
              <Icon.PlusSquare
                size={20}
                className="ml-3 icon-action"
                onClick={() => props.addChoice(props.id)}
              />
            )}
          </Form.Label>
          {props.choices?.map((c, k) => (
            <Row key={k}>
              <Col sm={5} className="pb-3">
                <Form.Control
                  required
                  type="text"
                  placeholder={`Enter Choice ${k + 1}`}
                  value={c}
                  onChange={(e) =>
                    props.change(e.target.value, props.id, "choices", k)
                  }
                />
                <Form.Control.Feedback type="invalid">
                  Text is required!
                </Form.Control.Feedback>
              </Col>
              {!k ? null : (
                <Icon.Trash
                  size={18}
                  className="mt-2 ml-2 icon-action"
                  onClick={() => props.delete(props.id, k)}
                />
              )}
            </Row>
          ))}
        </Col>
      </Row>
    </>
  );
}

export default Editor;

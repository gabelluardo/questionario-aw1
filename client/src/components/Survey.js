import { useEffect, useState } from "react";
import { Alert, Button, Col, Form, Row } from "react-bootstrap";
import * as Icon from "react-bootstrap-icons";

function Survey(props) {
  const [reply, setReply] = useState([]);
  const [questions, setQuestions] = useState([]);

  const [validated, setValidated] = useState(false);
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    async function getQuestions(id) {
      const q = await props.retriveQuestions(id);
      if (!q.err) {
        console.log(q);
        setQuestions(q);
        const r = q.map((q) => ({
          isValid: null,
          id: q.question_id,
          choices: [...q.choices].fill(false),
          text: "",
        }));

        console.log(r);

        setReply(r);
      }
    }

    getQuestions(props.survey.id);
  }, []);

  const handleSubmit = async (e) => {
    const form = e.currentTarget;
    e.preventDefault();
    e.stopPropagation();

    // if (!questions.length) {
    //   setAlert("Insert at least one question");
    //   setValidated(false);
    //   return;
    // } else {
    //   setValidated(true);
    // }

    // if (form.checkValidity()) {
    //   const survey = { title: title, questions: questions };
    //   console.log(survey);

    //   const res = await props.create(survey);
    //   if (!res.err) {
    //     props.history.push("/");
    //   } else {
    //     setAlert(res.err);
    //   }
    // }

    console.log(questions);
  };

  const handleChange = (value, key, type, choiceKey = null) => {
    if (choiceKey == null) {
      reply[key][type] = value;
    } else {
      if (type === "radio") {
        const c = reply[key].choices;
        reply[key].choices = c.map((_, k) => (k !== choiceKey ? false : true));
      } else {
        reply[key].choices[choiceKey] = value;
      }
    }

    console.log(reply[key].choices);
    setReply([...reply]);
  };

  return (
    <Row className="vheight-100">
      <Col className="px-5 py-4 mt-5">
        <Row className="mx-auto view-title d-flex justify-content-between">
          <h1>
            <b>Survey</b>
          </h1>
          <h2 className="pt-5">
            <b>{props.survey.title}</b>
          </h2>
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
              <Form.Group className="mb-3" controlId="formBasicEmail">
                {questions.map((q, k) => (
                  <Question
                    {...q}
                    key={k}
                    id={k}
                    change={handleChange}
                    closed={q.optional == null}
                    reply={reply[k]}
                    radio={q.max === 1}
                  />
                ))}
              </Form.Group>

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
    <Row className="pt-2">
      <Col>
        <Form.Control
          required={!props.optional}
          as="textarea"
          rows={5}
          placeholder="Enter Your Answer"
          value={props.reply?.text}
          onChange={(ev) => props.change(ev.target.value, props.id, "text")}
        />
        <Form.Control.Feedback type="invalid">
          This answare is manadtory!
        </Form.Control.Feedback>
      </Col>
    </Row>
  );

  const closedType = (
    <Row className="pt-2">
      <Col>
        {props.choices?.map((text, k) => (
          <Row key={k} className="pb-2">
            <Col sm={5}>
              <Form.Check
                label={text}
                type={props.radio ? "radio" : "checkbox"}
                id={k}
                name={`group-${props.id}`}
                onChange={() =>
                  props.change(
                    !props.reply.choices[k],
                    props.id,
                    props.radio ? "radio" : "choices",
                    k
                  )
                }
              />
              <Form.Control.Feedback type="invalid">
                Almost {props.max} and at least {props.min} selection!
              </Form.Control.Feedback>
            </Col>
          </Row>
        ))}
      </Col>
    </Row>
  );

  return (
    <Form.Group className="my-4">
      <Row>
        <Col>
          <Form.Label as="h4" className="text-wrap">
            {props.id + 1}. {props.text}{" "}
          </Form.Label>
        </Col>
        <Col sm={3}>
          <p
            className={`text-${
              props.reply?.text.length <= 200 ? `muted` : `danger`
            } pt-1`}
          >
            {props.closed
              ? `(min: ${props.min}; max: ${props.max})`
              : `(${200 - props.reply?.text.length} characters)`}
          </p>
        </Col>
      </Row>
      {props.closed ? closedType : openedType}
      <hr />
    </Form.Group>
  );
}

export default Survey;

import { useEffect, useState } from "react";
import { Alert, Button, Col, Form, Row } from "react-bootstrap";
import * as Icon from "react-bootstrap-icons";

function Survey(props) {
  const [replies, setReplies] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [user, setUser] = useState("");

  const [validated, setValidated] = useState(false);
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    async function getQuestions(id) {
      const q = await props.handleGetQuestions(id);
      if (!q.err) {
        setQuestions(q);
        const r = q.map((q) => ({
          isInvalid: null,
          id: q.question_id,
          choices: [...q.choices].fill(false),
          text: "",
        }));

        setReplies(r);
      }
    }

    getQuestions(props.survey.id);
  }, [props]);

  const customValidation = () => {
    const r = replies.map((r) => {
      const q = questions.find((q) => q.question_id === r.id);

      if (!r.choices.length) {
        const opt = r.text.length === 0 && !q.optional;
        r.isInvalid = r.text.length > 200 || opt;
      } else {
        const c = r.choices.filter(Boolean).length;
        r.isInvalid = !(c <= q.max && c >= q.min);
      }
      return r;
    });

    setReplies([...r]);

    return !replies.filter((r) => r.isInvalid).length;
  };

  const handleSubmit = async (e) => {
    const form = e.currentTarget;
    e.preventDefault();
    e.stopPropagation();

    const valid = customValidation();
    if (form.checkValidity() && valid) {
      const reply = replies.map((r) =>
        Object({
          text: r.text || null,
          question_id: r.id,
          choices: r.choices,
          user: user,
          survey_id: props.survey.id,
        })
      );
      console.log(reply);

      const res = await props.handleReply(reply);
      if (!res.err) {
        // props.history.push("/");
      } else {
        setAlert(res.err);
      }
    }

    setValidated(true);
  };

  const handleChangeText = (value, key) => {
    const r = replies[key];
    r.text = value;

    const q = questions.find((q) => q.question_id === r.id);
    const opt = r.text.length === 0 && !q.optional;
    r.isInvalid = r.text.length > 200 || opt;

    replies[key] = r;
    setReplies([...replies]);
  };

  const handleChangeCheck = (value, key, i, radio = false) => {
    const r = replies[key];

    if (radio) {
      const c = r.choices;
      r.choices = c.map((_, k) => (k !== i ? false : true));
    } else {
      r.choices[i] = value;
    }

    const q = questions.find((q) => q.question_id === r.id);
    const c = r.choices.filter(Boolean).length;
    r.isInvalid = !(c <= q.max && c >= q.min);

    replies[key] = r;
    setReplies([...replies]);
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

            <Form noValidate onSubmit={handleSubmit}>
              {questions.map((q, k) => (
                <Form.Group key={k} className="mb-3">
                  <Question
                    {...q}
                    id={k}
                    changeText={handleChangeText}
                    changeCheck={handleChangeCheck}
                    closed={q.optional == null}
                    reply={replies[k]}
                    radio={q.max === 1}
                    validated={validated}
                  />
                </Form.Group>
              ))}
              <Form.Group as={Row} className="pb-1 justify-content-end">
                <Col sm={4}>
                  <Form.Label as="h4">Sign</Form.Label>
                  <Form.Control
                    required
                    type="text"
                    placeholder="Enter Your Name"
                    value={user}
                    isInvalid={!user.length && validated}
                    isValid={user.length && validated}
                    onChange={(e) => setUser(e.target.value)}
                  />
                  <Form.Control.Feedback type="invalid">
                    Please sign this survey reply!
                  </Form.Control.Feedback>
                </Col>
              </Form.Group>
              {/* <hr /> */}
              {!questions.length ? null : (
                <Row className="d-flex justify-content-end pt-2">
                  <Button
                    className="mx-3"
                    variant="secondary"
                    // onClick={() => props.history.push("/")}
                    onClick={() => setValidated(false)}
                  >
                    Cancel
                  </Button>
                  <Button className="mr-3" variant="success" type="submit">
                    Send
                  </Button>
                </Row>
              )}
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
          isInvalid={props.reply?.isInvalid && props.validated}
          isValid={
            props.validated &&
            !props.reply?.isInvalid &&
            props.reply?.isInvalid !== null
          }
          onChange={(ev) => props.changeText(ev.target.value, props.id)}
        />
        <Form.Control.Feedback type="invalid">
          {!(props.reply?.text.length > 200)
            ? "This answer is mandatory!"
            : "This answer must have almost 200 characters!"}
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
                custom
                id={`custom-${props.id}-${k}`}
                name={`group-${props.id}`}
                type={props.radio ? "radio" : "checkbox"}
                isInvalid={props.reply?.isInvalid && props.validated}
                isValid={
                  props.validated &&
                  !props.reply?.isInvalid &&
                  props.reply?.isInvalid !== null
                }
                checked={props.reply?.choices[k]}
                label={text}
                onChange={() =>
                  props.changeCheck(
                    !props.reply.choices[k],
                    props.id,
                    k,
                    props.radio
                  )
                }
              />
            </Col>
          </Row>
        ))}

        {!(props.reply?.isInvalid && props.validated) ? null : (
          <Form.Text className="text-danger">
            {`Almost ${props.max} and at least ${props.min} answers!`}
          </Form.Text>
        )}
      </Col>
    </Row>
  );

  return (
    <Form.Group className="my-4">
      <Form.Row>
        <Col>
          <Form.Label as="h4" className="text-wrap">
            {props.id + 1}. {props.text}{" "}
          </Form.Label>
        </Col>
        <Col sm={3}>
          <Info
            {...props}
            warning={props.reply?.text.length > 200}
            char={props.reply?.text.length}
          />
        </Col>
      </Form.Row>
      {props.closed ? closedType : openedType}
      <hr />
    </Form.Group>
  );
}

function Info(props) {
  const openedType = `(${200 - props.char} characters)`;
  const closedType = `(min: ${props.min}; max: ${props.max})`;
  const textType = `text-${props.warning ? `danger` : `muted`}`;

  return (
    <p className={`${textType} pt-1`}>
      {props.closed ? closedType : openedType}
    </p>
  );
}

export default Survey;

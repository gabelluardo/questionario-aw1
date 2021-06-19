import { useEffect, useState } from "react";
import { Alert, Button, Col, Form, Row } from "react-bootstrap";
import * as Icon from "react-bootstrap-icons";

function Survey(props) {
  const [replies, setReplies] = useState([]);
  const [allReplies, setAllReplies] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [user, setUser] = useState("");

  const [validated, setValidated] = useState(false);
  const [alert, setAlert] = useState(null);
  const [position, setPosition] = useState(0);

  useEffect(() => {
    async function getQuestions(id) {
      const q = await props.handleGetQuestions(id);
      if (!q.err) {
        setQuestions(q);

        if (props.readOnly) {
          /* Retrive replies for this survey from server */

          const r = await props.handleGetReply(id);
          if (r) {
            const all = parseAllReplies(r);
            const current = all[0];

            setReplies(current.replies);
            setUser(current.user);
            setAllReplies(all);
          }
        } else {
          /* Create a default response object */

          const r = q.map((q) => ({
            isInvalid: null,
            id: q.question_id,
            choices: [...q.choices].fill(false),
            text: "",
          }));
          setReplies(r);
        }
      }
    }

    getQuestions(props.survey.id);
  }, [props]);

  useEffect(() => {
    if (props.readOnly) {
      const r = allReplies[position];
      if (r) {
        setUser(r.user);
        setReplies([...r.replies]);
      }
    }
  }, [position, allReplies, props.readOnly]);

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

  const parseAllReplies = (r) => {
    let res = [];

    r.forEach((e) => {
      const r = res.find((r) => r.user === e.user);

      if (r) {
        r.replies.push(e);
      } else {
        res.push({ user: e.user, replies: [e] });
      }
    });

    return res;
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
          choices: r.choices.length ? r.choices : null,
          user: user,
          survey_id: props.survey.id,
        })
      );

      const res = await props.handleReply({ reply: reply });
      if (!res.err) {
        return props.history.push("/");
      } else {
        setAlert(res.err);
        setValidated(false);
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
                <Question
                  {...q}
                  key={k}
                  id={k}
                  readOnly={props.readOnly}
                  changeText={handleChangeText}
                  changeCheck={handleChangeCheck}
                  closed={q.optional == null}
                  reply={replies[k]}
                  radio={q.max === 1}
                  validated={validated}
                />
              ))}

              <Sign
                {...props}
                show={questions.length}
                user={user}
                setUser={setUser}
                validated={validated}
              />

              <ActionButtons
                {...props}
                show={!props.readOnly && questions.length}
              />
            </Form>
          </Col>
        </Row>

        <Navigation
          {...props}
          show={props.readOnly && allReplies.length > 1}
          first={position === 0}
          last={position === allReplies.length - 1}
          setPosition={setPosition}
        />
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
          readOnly={props.readOnly}
          as="textarea"
          rows={5}
          placeholder="Enter Your Answer"
          value={props.reply?.text || ""}
          isInvalid={props.reply?.isInvalid && props.validated}
          isValid={
            props.validated &&
            !props.reply?.isInvalid &&
            props.reply?.isInvalid !== null
          }
          onChange={(ev) => props.changeText(ev.target.value, props.id)}
        />
        <Form.Control.Feedback type="invalid">
          {!(props.reply?.text?.length > 200)
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
                disabled={props.readOnly}
                id={`custom-${props.id}-${k}`}
                name={`group-${props.id}`}
                type={props.radio ? "radio" : "checkbox"}
                isInvalid={props.reply?.isInvalid && props.validated}
                isValid={
                  props.validated &&
                  !props.reply?.isInvalid &&
                  props.reply?.isInvalid !== null
                }
                defaultChecked={props.reply?.choices[k]}
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
    <Form.Group className="my-4 mb-3">
      <Form.Row>
        <Col>
          <Form.Label as="h4" className="text-wrap">
            {props.id + 1}. {props.text}{" "}
          </Form.Label>
        </Col>
        <Col sm={3}>
          <QuestionInfo
            {...props}
            warning={props.reply?.text?.length > 200}
            char={props.reply?.text?.length}
          />
        </Col>
      </Form.Row>
      {props.closed ? closedType : openedType}
      <hr />
    </Form.Group>
  );
}

function QuestionInfo(props) {
  const openedType = `(${200 - props.char || 200} characters left)`;
  const closedType = `(min: ${props.min}; max: ${props.max})`;
  const textType = `text-${props.warning ? `danger` : `muted`}`;

  return (
    <p className={`${textType} pt-1`}>
      {props.closed ? closedType : openedType}
    </p>
  );
}

function Sign(props) {
  return !props.show ? null : (
    <Form.Group as={Row} className="pb-1 justify-content-end">
      <Col sm={4}>
        <Form.Label as="h4">Sign</Form.Label>
        <Form.Control
          required
          readOnly={props.readOnly}
          type="text"
          placeholder="Enter Your Name"
          value={props.user}
          isInvalid={!props.user.length && props.validated}
          isValid={props.user.length && props.validated}
          onChange={(e) => props.setUser(e.target.value)}
        />
        <Form.Control.Feedback type="invalid">
          Please sign this survey reply!
        </Form.Control.Feedback>
      </Col>
    </Form.Group>
  );
}

function ActionButtons(props) {
  return !props.show ? null : (
    <Row className="d-flex justify-content-end pt-2">
      <Button
        className="mx-3"
        variant="secondary"
        onClick={() => props.history.push("/")}
      >
        Cancel
      </Button>
      <Button className="mr-3" variant="success" type="submit">
        Send
      </Button>
    </Row>
  );
}

function Navigation(props) {
  return !props.show ? null : (
    <Row className="pt-5">
      {props.first ? null : (
        <Icon.ArrowReturnLeft
          size={32}
          className="icon-action mr-auto"
          onClick={() => props.setPosition((p) => p - 1)}
        />
      )}
      {props.last ? null : (
        <Icon.ArrowReturnRight
          size={32}
          className="icon-action ml-auto"
          onClick={() => props.setPosition((p) => p + 1)}
        />
      )}
    </Row>
  );
}

export default Survey;

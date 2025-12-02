
import React, { useState, type ChangeEvent, type FormEvent } from 'react'
import { Row, Col, Button, Card, Modal, Container, InputGroup, Form } from 'react-bootstrap'
import { NavBar } from './NavBar'
import { useNavigate } from 'react-router-dom'
import styles from './LessonFeedbackPage.module.css'

type Mode = 'teacher' | 'student'

interface Props {
  mode: Mode
  lessonTitle: string
}

interface Feedback {
  id: string
  name: string
  comment: string
}

const sampleStudents: Feedback[] = [
  { id: 's1', name: 'Student 1', comment: 'I think this lesson is too hard' },
  { id: 's2', name: 'Student 2', comment: 'Could use more examples' },
  { id: 's3', name: 'Student 3', comment: 'Loved the group activity' },
]

const sampleStudentOwn: Feedback[] = [
{ id: 'me', name: 'Feedback 1', comment: 'I think this lesson is too hard'}
]

const LessonFeedbackPage: React.FC<Props> = ({ mode, lessonTitle }) => {
  const isTeacher = mode === 'teacher'
  const [show, setShow] = useState(false);
  const [editShow, setEditShow] = useState(false);
  const [feedback, setFeedback] = useState<Feedback>({
    id: 'me', name: `Feedback ${sampleStudentOwn.length + 1}`, comment: ''
  })
  const [studentFeedbacks, setStudentFeedbacks] = useState<Feedback[]>(sampleStudentOwn);


  const handleDownload = () => {
    console.log('Download feedback clicked')

    //Text Generation
    var downloadableText = "";
    for(let i = 0; i<sampleStudents.length; i++) {
      downloadableText = downloadableText + "ID: " + sampleStudents[i].id + " | Student Name: " + sampleStudents[i].name + " | Comment: " + sampleStudents[i].comment + "\n"; 
    }

    //Actual download generation
    const element = document.createElement("a");
    const file = new Blob([downloadableText], {type: "text/plain"});
    element.href=URL.createObjectURL(file);
    element.download="exportedFeedback.txt";
    document.body.appendChild(element);
    element.click();
  }

  const handleGive = () => {
    console.log('Give feedback clicked')
    setShow(true);
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setStudentFeedbacks(prev => [...prev, feedback])

    // clears text area
    setFeedback(prev => ({
      ...prev,
      comment: ''
    }));

    console.log(studentFeedbacks)
    setShow(false);
  }

  const handleEdit = (id: string) => {
    console.log('Edit feedback', id)
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFeedback((prevData) => ({
      ...prevData,
      name: `Feedback ${studentFeedbacks.length + 1}`,
      [name]: value
    }))
  }

  const handleClose = () => setShow(false);

  const handleEditShow = () => {
    setEditShow(true)
  };

  const handleEditClose = () => setEditShow(false);

  const navigate = useNavigate()

  const handleBack = () => {
    // if there's history, go back; otherwise go to main
    if (window.history.length > 1) {
      navigate(-1)
    } else {
      navigate('/main')
    }
  }

  return (
    <>
      <NavBar></NavBar>
      <Container className={styles.page}>
        <h1 className={styles.header}>Feedback</h1>
        <div className={styles.content}>
          <div className={styles.contentInner}>
          <Button variant="link" className={`${styles.backButton}`} onClick={handleBack} aria-label="Go back">←</Button>
          <h2 className={styles.sectionTitle}>{isTeacher ? 'Student Feedback' : 'Your Feedback'}</h2>

          {isTeacher ? (
            <div className={styles.feedbackList}>
              {sampleStudents.map((s) => (
                <Card key={s.id} className={`mb-3 ${styles.feedbackCard}`}>
                  <Card.Body>
                    <Row className="align-items-start">
                      <Col xs="auto">
                        <div className={styles.cardIcon}>{s.name.split(' ').map(n=>n[0]).join('').slice(0,2)}</div>
                      </Col>
                      <Col>
                        <div className={styles.cardTitle}>{s.name}</div>
                        <div className={styles.cardSubtitle}>{s.comment}</div>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
              ))}

              <Button variant="dark" className="w-100 mt-2" onClick={handleDownload}>
                Download Feedback
              </Button>
            </div>
          ) : (
            <div className={styles.feedbackList}>
              {studentFeedbacks.map((s) => (
                <Card className={`${styles.feedbackCard}`}>
                  <Card.Body>
                    <div className="d-flex align-items-start justify-content-between">
                      <div>
                        <div className={styles.cardTitle}>{s.name}</div>
                        <div className={styles.cardSubtitle}>{s.comment}</div>
                      </div>

                      <div>
                        <Button variant="link" className={styles.editButton} onClick={handleEditShow} aria-label="Edit">
                          ✏️
                        </Button>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              ))}
              <Button variant="dark" className="w-100 mt-2" onClick={handleGive}>
                Give Feedback
              </Button>
            </div>
          )}
          </div>
        </div>
      </Container>

      {/* Feedback Model and submission logic */}
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Give Feedback</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
        <Modal.Body>
          <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
            <Form.Label>Leave your feedback here</Form.Label>
            <Form.Control as="textarea" rows={3} name="comment" value={feedback.comment} onChange={handleChange}/>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button type='submit' variant="primary">
            Save Changes
          </Button>
        </Modal.Footer>
        </Form>
      </Modal>

      {/* Edit Feedback */}
      <Modal show={editShow} onHide={handleEditClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Feedback</Modal.Title>
        </Modal.Header>
        <Form >
        <Modal.Body>
          <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
            <Form.Label>Edit your feedback</Form.Label>
            <Form.Control as="textarea" rows={3} name="comment" value={feedback.comment} onChange={handleChange}></Form.Control>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleEditClose}>
            Close
          </Button>
          <Button type='submit' variant="primary">
            Save Changes
          </Button>
        </Modal.Footer>
        </Form>
      </Modal>
    </>
  )
}

export default LessonFeedbackPage

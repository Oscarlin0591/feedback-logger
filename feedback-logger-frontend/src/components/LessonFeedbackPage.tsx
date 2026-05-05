
import React, { useEffect, useState, type ChangeEvent, type FormEvent } from 'react'
import { Row, Col, Button, Card, Modal, Container, Form } from 'react-bootstrap'
import { NavBar } from './NavBar'
import { useNavigate, useParams } from 'react-router-dom'
import styles from './LessonFeedbackPage.module.css'

type Mode = 'teacher' | 'student'

interface Props {
  mode: Mode
  lessonTitle: string
  courseCode: string
  lessonNumber: number
}

interface Feedback {
  _id: string
  comment: string
  author: { _id: string; name: string }
}

const LessonFeedbackPage: React.FC<Props> = ({ mode, lessonTitle }) => {
  const isTeacher = mode === 'teacher'
  const { id: courseCode, lessonId } = useParams<{ id: string; lessonId: string }>();
  const [show, setShow] = useState(false);
  const [editShow, setEditShow] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [studentFeedbacks, setStudentFeedbacks] = useState<Feedback[]>([]);

  const [editId, setEditId] = useState<string | null>(null);

  const apiBase = `/api/comments/${courseCode}/${lessonId}`;
  const token = localStorage.getItem('token');
  const authHeader = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    fetch(apiBase, { headers: authHeader })
      .then((r) => r.json())
      .then((data: Feedback[]) => setStudentFeedbacks(data))
      .catch(console.error);
  }, [apiBase]);

  const handleDownload = () => {
    const downloadableText = studentFeedbacks
      .map((s) => `Student: ${s.author.name} | Comment: ${s.comment}`)
      .join('\n');

    const element = document.createElement("a");
    const file = new Blob([downloadableText], {type: "text/plain"});
    element.href = URL.createObjectURL(file);
    element.download = "exportedFeedback.txt";
    document.body.appendChild(element);
    element.click();
  }

  const handleGive = () => setShow(true)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const res = await fetch(apiBase, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...authHeader },
      body: JSON.stringify({ comment: commentText }),
    });
    if (res.ok) {
      const created: Feedback = await res.json();
      setStudentFeedbacks(prev => [...prev, created]);
      setCommentText('');
      setShow(false);
    }
  }

  const handleEdit = (_id: string) => {
    const selectedFeedback = studentFeedbacks.find(fb => fb._id === _id);
    if (!selectedFeedback) return;

    setEditId(_id);
    setCommentText(selectedFeedback.comment);
    setEditShow(true);
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setCommentText(e.target.value);
  }

  const handleClose = () => {
    setCommentText('');
    setShow(false);
  };

  const handleEditSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!editId) return;
    const res = await fetch(`/api/comments/${editId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...authHeader },
      body: JSON.stringify({ comment: commentText }),
    });
    if (res.ok) {
      const updated: Feedback = await res.json();
      setStudentFeedbacks(prev => prev.map(fb => fb._id === editId ? updated : fb));
      setCommentText('');
      setEditShow(false);
    }
  }

  const handleEditClose = () => {
    setCommentText('');
    setEditShow(false);
  };

  const navigate = useNavigate()

  const handleBack = () => {
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
        <h1 className={styles.header}>{lessonTitle}</h1>
        <div className={styles.content}>
          <div className={styles.contentInner}>
            <Button variant="link" className={`${styles.backButton}`} onClick={handleBack} aria-label="Go back">←</Button>
            <h2 className={styles.sectionTitle}>{isTeacher ? 'Student Feedback' : 'Your Feedback'}</h2>

          {isTeacher ? (
            <div className={styles.feedbackList}>
              {studentFeedbacks.length === 0 && (
                <p className="text-muted">No feedback submitted yet.</p>
              )}
              {studentFeedbacks.map((s) => (
                <Card key={s._id} className={`mb-3 ${styles.feedbackCard}`}>
                  <Card.Body>
                    <Row className="align-items-start">
                      <Col xs="auto">
                        <div className={styles.cardIcon}>A</div>
                      </Col>
                      <Col>
                        <div className={styles.cardTitle}>Anonymous Student</div>
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
              {studentFeedbacks.map((s, i) => (
                <Card key={s._id} className={`${styles.feedbackCard}`}>
                  <Card.Body>
                    <div className="d-flex align-items-start justify-content-between">
                      <div>
                        <div className={styles.cardTitle}>{`Feedback ${i + 1}`}</div>
                        <div className={styles.cardSubtitle}>{s.comment}</div>
                      </div>

                      <div>
                        <Button variant="link" className={styles.editButton} onClick={() => handleEdit(s._id)} aria-label="Edit">
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

      {/* Give Feedback modal */}
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Give Feedback</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
        <Modal.Body>
          <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
            <Form.Label>What did you think of this lesson?</Form.Label>
            <Form.Control as="textarea" rows={3} name="comment" value={commentText} onChange={handleChange} required/>
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

      {/* Edit Feedback modal */}
      <Modal show={editShow} onHide={handleEditClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Feedback</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleEditSubmit}>
        <Modal.Body>
          <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
            <Form.Label>Edit your feedback</Form.Label>
            <Form.Control as="textarea" rows={3} name="comment" value={commentText} onChange={handleChange} required></Form.Control>
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

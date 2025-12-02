
import React, { useState } from 'react'
import { Row, Col, Button, Card, Modal, Container } from 'react-bootstrap'
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

let sampleStudentOwn: Feedback[] = [
{ id: 'me', name: 'Feedback 1', comment: 'I think this lesson is too hard'}
]

const LessonFeedbackPage: React.FC<Props> = ({ mode, lessonTitle }) => {
  const isTeacher = mode === 'teacher'
  const [show, setShow] = useState(false);


  const handleDownload = () => {
    console.log('Download feedback clicked')
  }

  const handleGive = () => {
    console.log('Give feedback clicked')
    const newFeedback : Feedback = {id: 'me', name: 'Feedback 2', comment: 'I like this lesson'}
    sampleStudentOwn = [
      ...sampleStudentOwn,
      newFeedback
    ]
    setShow(true);
  }

  const handleEdit = (id: string) => {
    console.log('Edit feedback', id)
  }

  const handleClose = () => setShow(false);

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
              {sampleStudentOwn.map((s) => (
                <Card className={`${styles.feedbackCard}`}>
                  <Card.Body>
                    <div className="d-flex align-items-start justify-content-between">
                      <div>
                        <div className={styles.cardTitle}>{s.name}</div>
                        <div className={styles.cardSubtitle}>{s.comment}</div>
                      </div>

                      <div>
                        <Button variant="link" className={styles.editButton} onClick={() => handleEdit(s.id)} aria-label="Edit">
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
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Modal heading</Modal.Title>
        </Modal.Header>
        <Modal.Body>Woohoo, you are reading this text in a modal!</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleClose}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default LessonFeedbackPage

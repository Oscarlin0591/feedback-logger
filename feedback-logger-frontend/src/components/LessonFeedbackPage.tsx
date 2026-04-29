import React, { useState, useEffect, type ChangeEvent, type FormEvent } from 'react'
import { Row, Col, Button, Card, Modal, Container, Form } from 'react-bootstrap'
import { NavBar } from './NavBar'
import { useNavigate } from 'react-router-dom'
import styles from './LessonFeedbackPage.module.css'
import { apiGet, apiPost, apiPatch } from '../api'
import type { ApiComment } from '../types'

type Mode = 'teacher' | 'student'

interface Props {
  mode: Mode
  lessonTitle: string
  courseCode: string
  lessonNumber: number
}

interface Feedback {
  id: string
  name: string
  comment: string
}

const LessonFeedbackPage: React.FC<Props> = ({ mode, lessonTitle, courseCode, lessonNumber }) => {
  const isTeacher = mode === 'teacher'
  const commentsPath = `/courses/${courseCode}/lessons/${lessonNumber}/comments`

  const [show, setShow] = useState(false)
  const [editShow, setEditShow] = useState(false)
  const [feedback, setFeedback] = useState<Feedback>({ id: '', name: '', comment: '' })
  const [studentFeedbacks, setStudentFeedbacks] = useState<Feedback[]>([])
  const [teacherFeedbacks, setTeacherFeedbacks] = useState<Feedback[]>([])
  const [editId, setEditId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    apiGet<ApiComment[]>(commentsPath)
      .then((data) => {
        if (isTeacher) {
          setTeacherFeedbacks(data.map((c) => ({
            id: c.id,
            name: c.authorName ?? 'Unknown',
            comment: c.comment,
          })))
        } else {
          setStudentFeedbacks(data.map((c, i) => ({
            id: c.id,
            name: `Feedback ${i + 1}`,
            comment: c.comment,
          })))
        }
      })
      .catch(() => setError('Failed to load feedback'))
      .finally(() => setLoading(false))
  }, [commentsPath, isTeacher])

  const handleDownload = () => {
    let downloadableText = ''
    for (const s of teacherFeedbacks) {
      downloadableText += `ID: ${s.id} | Student Name: ${s.name} | Comment: ${s.comment}\n`
    }
    const element = document.createElement('a')
    const file = new Blob([downloadableText], { type: 'text/plain' })
    element.href = URL.createObjectURL(file)
    element.download = 'exportedFeedback.txt'
    document.body.appendChild(element)
    element.click()
  }

  const handleGive = () => setShow(true)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    try {
      const newComment = await apiPost<ApiComment>(commentsPath, { comment: feedback.comment })
      setStudentFeedbacks((prev) => [
        ...prev,
        { id: newComment.id, name: `Feedback ${prev.length + 1}`, comment: newComment.comment },
      ])
    } catch {
      setError('Failed to submit feedback')
    }
    setFeedback((prev) => ({ ...prev, comment: '' }))
    setShow(false)
  }

  const handleEdit = (id: string) => {
    const selected = studentFeedbacks.find((fb) => fb.id === id)
    if (!selected) return
    setEditId(id)
    setFeedback(selected)
    setEditShow(true)
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFeedback((prev) => ({ ...prev, [name]: value }))
  }

  const handleClose = () => {
    setFeedback((prev) => ({ ...prev, comment: '' }))
    setShow(false)
  }

  const handleEditSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!editId) return
    try {
      await apiPatch<ApiComment>(`${commentsPath}/${editId}`, { comment: feedback.comment })
      setStudentFeedbacks((prev) =>
        prev.map((fb) => (fb.id === editId ? { ...fb, comment: feedback.comment } : fb))
      )
    } catch {
      setError('Failed to update feedback')
    }
    setFeedback((prev) => ({ ...prev, comment: '' }))
    setEditShow(false)
  }

  const handleEditClose = () => {
    setFeedback((prev) => ({ ...prev, comment: '' }))
    setEditShow(false)
  }

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
            {loading && <p>Loading feedback...</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}

            {isTeacher ? (
              <div className={styles.feedbackList}>
                {teacherFeedbacks.map((s) => (
                  <Card key={s.id} className={`mb-3 ${styles.feedbackCard}`}>
                    <Card.Body>
                      <Row className="align-items-start">
                        <Col xs="auto">
                          <div className={styles.cardIcon}>{s.name.split(' ').map(n => n[0]).join('').slice(0, 2)}</div>
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
                  <Card key={s.id} className={`${styles.feedbackCard}`}>
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

      {/* Give Feedback modal */}
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Give Feedback</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3" controlId="feedbackTextarea">
              <Form.Label>What did you think of this lesson?</Form.Label>
              <Form.Control as="textarea" rows={3} name="comment" value={feedback.comment} onChange={handleChange} required />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>Close</Button>
            <Button type="submit" variant="primary">Save Changes</Button>
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
            <Form.Group className="mb-3" controlId="editFeedbackTextarea">
              <Form.Label>Edit your feedback</Form.Label>
              <Form.Control as="textarea" rows={3} name="comment" value={feedback.comment} onChange={handleChange} required />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleEditClose}>Close</Button>
            <Button type="submit" variant="primary">Save Changes</Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  )
}

export default LessonFeedbackPage

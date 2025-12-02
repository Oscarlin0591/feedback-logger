
import React from 'react'
import { Container, Row, Col, Navbar, Button, Card } from 'react-bootstrap'
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

const sampleStudentOwn: Feedback = {
  id: 'me',
  name: 'Feedback 1',
  comment: 'I think this lesson is too hard',
}

const LessonFeedbackPage: React.FC<Props> = ({ mode, lessonTitle }) => {
  const isTeacher = mode === 'teacher'

  const handleDownload = () => {
    console.log('Download feedback clicked')
  }

  const handleGive = () => {
    console.log('Give feedback clicked')
  }

  const handleEdit = (id: string) => {
    console.log('Edit feedback', id)
  }

  return (
    <div className={styles.pageRoot}>
      <div className="d-flex align-items-stretch">
        <div className={styles.logoColumn}>
          <div className={styles.logoIcon} />
        </div>

        <Navbar bg="white" className={`${styles.header} border-bottom`}>
          <Container fluid className={`d-flex align-items-center ${styles.headerInner}`}>
            <Button variant="link" className={`${styles.backButton}`}>←</Button>

            <div className="mx-auto text-center">
              <div className={styles.title}>{lessonTitle}</div>
            </div>

            <div className={styles.headerRight}>
              <Button variant="link" className={styles.logoutButton}>Logout</Button>
              <div className={styles.avatar}>TS</div>
            </div>
          </Container>
        </Navbar>
      </div>

      <Container className={styles.content}>
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
            <Card className={`${styles.feedbackCard}`}>
              <Card.Body>
                <div className="d-flex align-items-start justify-content-between">
                  <div>
                    <div className={styles.cardTitle}>{sampleStudentOwn.name}</div>
                    <div className={styles.cardSubtitle}>{sampleStudentOwn.comment}</div>
                  </div>

                  <div>
                    <Button variant="link" className={styles.editButton} onClick={() => handleEdit(sampleStudentOwn.id)} aria-label="Edit">
                      ✏️
                    </Button>
                  </div>
                </div>
              </Card.Body>
            </Card>

            <Button variant="dark" className="w-100 mt-2" onClick={handleGive}>
              Give Feedback
            </Button>
          </div>
        )}
      </Container>
    </div>
  )
}

export default LessonFeedbackPage

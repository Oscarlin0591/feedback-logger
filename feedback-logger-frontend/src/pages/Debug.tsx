import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { Alert, Badge, Button, Card, Col, Container, Form, ListGroup, Row, Spinner } from "react-bootstrap";

interface Professor { _id: string; name: string; email: string; }
interface Student   { _id: string; name: string; email: string; courses: string[]; }
interface Course    { _id: string; title: string; courseCode: string; instructor: { _id: string; name: string; }; }

type Status = { variant: 'success' | 'danger'; message: string } | null;

const api = (path: string, opts?: RequestInit) => fetch(`/api/debug${path}`, opts);

function Debug() {
    const [professors, setProfessors] = useState<Professor[]>([]);
    const [students,   setStudents]   = useState<Student[]>([]);
    const [courses,    setCourses]    = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);

    const [courseForm, setCourseForm] = useState({ title: '', courseCode: '', description: '', instructorId: '' });
    const [courseStatus, setCourseStatus] = useState<Status>(null);
    const [courseSubmitting, setCourseSubmitting] = useState(false);

    const [enrollForm, setEnrollForm] = useState({ studentId: '', courseId: '' });
    const [enrollStatus, setEnrollStatus] = useState<Status>(null);
    const [enrollSubmitting, setEnrollSubmitting] = useState(false);

    const loadAll = async () => {
        setLoading(true);
        const [pRes, sRes, cRes] = await Promise.all([
            api('/professors'), api('/students'), api('/courses'),
        ]);
        setProfessors(await pRes.json());
        setStudents(await sRes.json());
        setCourses(await cRes.json());
        setLoading(false);
    };

    useEffect(() => { loadAll(); }, []);

    const handleCourseChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setCourseForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleCourseSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setCourseSubmitting(true);
        setCourseStatus(null);
        const res = await api('/course', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(courseForm),
        });
        const data = await res.json() as { message?: string; title?: string };
        if (res.ok) {
            setCourseStatus({ variant: 'success', message: `Course "${data.title}" created.` });
            setCourseForm({ title: '', courseCode: '', description: '', instructorId: '' });
            await loadAll();
        } else {
            setCourseStatus({ variant: 'danger', message: data.message ?? 'Failed to create course.' });
        }
        setCourseSubmitting(false);
    };

    const handleEnrollChange = (e: ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target;
        setEnrollForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleEnrollSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setEnrollSubmitting(true);
        setEnrollStatus(null);
        const res = await api('/enroll', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(enrollForm),
        });
        const data = await res.json() as { message: string };
        if (res.ok) {
            setEnrollStatus({ variant: 'success', message: data.message });
            setEnrollForm({ studentId: '', courseId: '' });
            await loadAll();
        } else {
            setEnrollStatus({ variant: 'danger', message: data.message ?? 'Enrollment failed.' });
        }
        setEnrollSubmitting(false);
    };

    if (loading) {
        return (
            <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
                <Spinner animation="border" />
            </Container>
        );
    }

    return (
        <Container className="py-4">
            <h1 className="mb-1">Debug Panel</h1>
            <p className="text-muted mb-4">Internal tool — not linked from the application.</p>

            <Row className="g-4">
                {/* ── Add Course ── */}
                <Col md={6}>
                    <Card>
                        <Card.Header><strong>Add Course</strong></Card.Header>
                        <Card.Body>
                            {courseStatus && (
                                <Alert variant={courseStatus.variant} dismissible onClose={() => setCourseStatus(null)}>
                                    {courseStatus.message}
                                </Alert>
                            )}
                            <Form onSubmit={handleCourseSubmit}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Title</Form.Label>
                                    <Form.Control name="title" value={courseForm.title} onChange={handleCourseChange} placeholder="e.g. Software Engineering" required />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Course Code</Form.Label>
                                    <Form.Control name="courseCode" value={courseForm.courseCode} onChange={handleCourseChange} placeholder="e.g. SER340" required />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Description <span className="text-muted">(optional)</span></Form.Label>
                                    <Form.Control as="textarea" rows={2} name="description" value={courseForm.description} onChange={handleCourseChange} />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Instructor</Form.Label>
                                    <Form.Select name="instructorId" value={courseForm.instructorId} onChange={handleCourseChange} required>
                                        <option value="">— select professor —</option>
                                        {professors.map((p) => (
                                            <option key={p._id} value={p._id}>{p.name} ({p.email})</option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>
                                <Button type="submit" variant="primary" disabled={courseSubmitting}>
                                    {courseSubmitting ? <Spinner size="sm" animation="border" /> : 'Create Course'}
                                </Button>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>

                {/* ── Enroll Student ── */}
                <Col md={6}>
                    <Card>
                        <Card.Header><strong>Enroll Student in Course</strong></Card.Header>
                        <Card.Body>
                            {enrollStatus && (
                                <Alert variant={enrollStatus.variant} dismissible onClose={() => setEnrollStatus(null)}>
                                    {enrollStatus.message}
                                </Alert>
                            )}
                            <Form onSubmit={handleEnrollSubmit}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Student</Form.Label>
                                    <Form.Select name="studentId" value={enrollForm.studentId} onChange={handleEnrollChange} required>
                                        <option value="">— select student —</option>
                                        {students.map((s) => (
                                            <option key={s._id} value={s._id}>{s.name} ({s.email})</option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Course</Form.Label>
                                    <Form.Select name="courseId" value={enrollForm.courseId} onChange={handleEnrollChange} required>
                                        <option value="">— select course —</option>
                                        {courses.map((c) => (
                                            <option key={c._id} value={c._id}>{c.courseCode} — {c.title}</option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>
                                <Button type="submit" variant="success" disabled={enrollSubmitting}>
                                    {enrollSubmitting ? <Spinner size="sm" animation="border" /> : 'Enroll Student'}
                                </Button>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>

                {/* ── Course list ── */}
                <Col md={6}>
                    <Card>
                        <Card.Header><strong>Courses</strong> <Badge bg="secondary">{courses.length}</Badge></Card.Header>
                        <ListGroup variant="flush" style={{ maxHeight: 300, overflowY: 'auto' }}>
                            {courses.length === 0
                                ? <ListGroup.Item className="text-muted">No courses yet.</ListGroup.Item>
                                : courses.map((c) => (
                                    <ListGroup.Item key={c._id}>
                                        <strong>{c.courseCode}</strong> — {c.title}
                                        <div className="text-muted small">Instructor: {c.instructor?.name ?? '—'}</div>
                                    </ListGroup.Item>
                                ))
                            }
                        </ListGroup>
                    </Card>
                </Col>

                {/* ── Student list ── */}
                <Col md={6}>
                    <Card>
                        <Card.Header><strong>Students</strong> <Badge bg="secondary">{students.length}</Badge></Card.Header>
                        <ListGroup variant="flush" style={{ maxHeight: 300, overflowY: 'auto' }}>
                            {students.length === 0
                                ? <ListGroup.Item className="text-muted">No students yet.</ListGroup.Item>
                                : students.map((s) => (
                                    <ListGroup.Item key={s._id}>
                                        <strong>{s.name}</strong> <span className="text-muted small">({s.email})</span>
                                        <div className="text-muted small">Enrolled in {s.courses.length} course(s)</div>
                                    </ListGroup.Item>
                                ))
                            }
                        </ListGroup>
                    </Card>
                </Col>

                {/* ── Professor list ── */}
                <Col md={12}>
                    <Card>
                        <Card.Header><strong>Professors</strong> <Badge bg="secondary">{professors.length}</Badge></Card.Header>
                        <ListGroup variant="flush" style={{ maxHeight: 200, overflowY: 'auto' }}>
                            {professors.length === 0
                                ? <ListGroup.Item className="text-muted">No professors yet.</ListGroup.Item>
                                : professors.map((p) => (
                                    <ListGroup.Item key={p._id}>
                                        <strong>{p.name}</strong> <span className="text-muted small">({p.email})</span>
                                    </ListGroup.Item>
                                ))
                            }
                        </ListGroup>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}

export default Debug;

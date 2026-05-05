import { useEffect, useState } from 'react'
import QULogo from './assets/qu-logo.png'
import { Container, Spinner } from 'react-bootstrap'
import { CourseCard } from './components/CourseCard'
import { NavBar } from './components/NavBar'

interface Course {
  _id: string;
  courseCode: string;
  title: string;
  description?: string;
  instructor: { name: string };
}

function App() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch('/api/auth/courses', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data: Course[]) => { setCourses(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  return (
    <>
    <NavBar/>
    <Container style={{display: 'flex', backgroundColor: 'black', height: '1px', width: '100%'}}></Container>
    <Container style={{
      display: "flex",
      width: "1280px",
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: 'space-between',
    }}>
      {loading ? (
        <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
          <Spinner animation="border" />
        </Container>
      ) : courses.length === 0 ? (
        <p className="text-muted mt-4">No courses found.</p>
      ) : (
        courses.map((c) => (
          <CourseCard
            key={c._id}
            img={QULogo}
            courseTitle={c.courseCode}
            courseDescription={c.title}
            courseNum={c.courseCode}
            profName={c.instructor?.name ?? '—'}
          />
        ))
      )}
     </Container>
    </>
  )
}

export default App;

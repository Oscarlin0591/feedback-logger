import { useEffect, useState } from 'react'
import QULogo from './assets/qu-logo.png'
import { Container } from 'react-bootstrap'
import { CourseCard } from './components/CourseCard'
import { NavBar } from './components/NavBar'
import { apiGet } from './api'
import type { ApiCourse } from './types'

function App() {
    const [courses, setCourses] = useState<ApiCourse[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        apiGet<ApiCourse[]>('/courses')
            .then(setCourses)
            .catch(() => setError('Failed to load courses. Is the backend running?'))
            .finally(() => setLoading(false));
    }, []);

    return (
        <>
        <NavBar></NavBar>
        <Container style={{display: 'flex', backgroundColor: 'black', height: '1px', width: '100%'}}></Container>
        <Container style={{
            display: "flex",
            width: "1280px",
            flexDirection: "row",
            flexWrap: "wrap",
            justifyContent: 'space-between',
        }}>
            {loading && <p>Loading courses...</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {courses.map((course) => (
                <CourseCard
                    key={course.courseCode}
                    img={QULogo}
                    courseTitle={course.title}
                    courseDescription={course.description}
                    courseNum={course.courseCode}
                    profName={course.instructorName}
                />
            ))}
        </Container>
        </>
    )
}

export default App;

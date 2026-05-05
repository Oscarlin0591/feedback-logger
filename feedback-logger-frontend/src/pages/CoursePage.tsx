import { NavBar } from "../components/NavBar";
import { Button, Container } from "react-bootstrap";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { WeekCard } from "../components/WeekCard";
import { LessonCard } from "../components/LessonCard";
import QULogo from '../assets/qu-logo.png'
import styles from './CoursePage.module.css';

export default function CoursePage() {
    const location = useLocation();
    const { courseTitle } = location.state || {};
    const { profName } = location.state || {};
    const { courseNum } = location.state || {};
    const curWeek = 3;

    const { id: courseId } = useParams();

    const weeks = Array.from({ length: 12 }, (_, i) => ({
        week: i + 1,
        lessons: [i * 2 + 1, i * 2 + 2],
    }));

    const navigate = useNavigate();

    const handleBack = () => {
        if (window.history.length > 1) {
            navigate(-1);
        } else {
            navigate('/main');
        }
    };

    return (
        <>
            <NavBar />
            <Button variant="link" className={styles.backButton} onClick={handleBack} aria-label="Go back">←</Button>
            <Container style={{ display: 'flex', backgroundColor: 'black', height: '1px', width: '100%' }} />
            <Container style={{
                display: 'flex',
                width: '1280px',
                flexDirection: 'column',
                margin: '0 auto',
                justifyContent: 'space-between',
            }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignContent: 'left' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', alignContent: 'left' }}>
                        <div className={styles.courseTitle}>{courseTitle}</div>
                        <div className={styles.smallText}>{profName}</div>
                        <div className={styles.smallText}>{courseNum}</div>
                    </div>
                    {weeks.map((w) => (
                        <WeekCard key={w.week} weekTitle={`Week ${w.week}`}>
                            {w.lessons.map((lessonId) => (
                                <LessonCard
                                    key={lessonId}
                                    courseId={courseId}
                                    img={QULogo}
                                    lessonTitle={`Lesson ${lessonId}`}
                                    lessonDesc={`This is Lesson ${lessonId}`}
                                    lessonID={lessonId}
                                    isLocked={w.week > curWeek}
                                />
                            ))}
                        </WeekCard>
                    ))}
                </div>
            </Container>
        </>
    );
}
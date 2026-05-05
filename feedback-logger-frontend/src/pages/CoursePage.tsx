import { useEffect, useState } from "react";
import { NavBar } from "../components/NavBar";
import { Button, Container } from "react-bootstrap";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { WeekCard } from "../components/WeekCard";
import { LessonCard } from "../components/LessonCard";
import QULogo from '../assets/qu-logo.png'
import styles from './CoursePage.module.css';
import { apiGet } from "../api";
import type { ApiLesson, ApiLessonsResponse } from "../types";

export default function CoursePage() {
    const location = useLocation();
    const { courseTitle } = location.state || {};
    const { profName } = location.state || {};
    const { courseNum } = location.state || {};
    const { id } = useParams(); // course code from URL, e.g. "MA-229"

    const [lessons, setLessons] = useState<ApiLesson[]>([]);
    const [currentLesson, setCurrentLesson] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!id) return;
        apiGet<ApiLessonsResponse>(`/courses/${id}/lessons`)
            .then((data) => {
                setLessons(data.lessons);
                setCurrentLesson(data.currentLesson);
            })
            .catch(() => setError('Failed to load lessons'))
            .finally(() => setLoading(false));
    }, [id]);

    // Group flat lessons array into weeks: lessonNumber 1-2 = week 1, 3-4 = week 2, etc.
    const weeks = lessons.reduce<{ week: number; lessons: ApiLesson[] }[]>((acc, lesson) => {
        const weekNum = Math.ceil(lesson.lessonNumber / 2);
        const existing = acc.find((w) => w.week === weekNum);
        if (existing) {
            existing.lessons.push(lesson);
        } else {
            acc.push({ week: weekNum, lessons: [lesson] });
        }
        return acc;
    }, []);

    const maxWeek = Math.ceil(currentLesson / 2);

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
                    {loading && <p>Loading lessons...</p>}
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                    {weeks
                        .filter((w) => w.week <= maxWeek)
                        .map((w) => (
                            <WeekCard key={w.week} weekTitle={`Week ${w.week}`}>
                                {w.lessons.map((lesson) => (
                                    <LessonCard
                                        key={lesson.id}
                                        courseId={id}
                                        img={QULogo}
                                        lessonTitle={lesson.title}
                                        lessonDesc={lesson.description}
                                        lessonID={lesson.lessonNumber}
                                        isLocked={lesson.lessonNumber > currentLesson}
                                    />
                                ))}
                            </WeekCard>
                        ))}
                </div>
            </Container>
        </>
    );
}

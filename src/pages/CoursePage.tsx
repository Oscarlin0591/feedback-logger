import { useEffect, useState } from "react";
import { NavBar } from "../components/NavBar";
import { Container } from "react-bootstrap";
import { useLocation, useParams } from "react-router-dom";
import { WeekCard } from "../components/WeekCard";
import { LessonCard } from "../components/LessonCard";
import QULogo from '../assets/qu-logo.png'
import styles from './CoursePage.module.css';

export default function CoursePage() {
    console.log("Clicked")
    const location = useLocation();
    const { courseTitle } = location.state || {};
    const { courseNum } = useParams();

    
    return (
        <>
            <NavBar></NavBar>
            <Container style={{display: 'flex', backgroundColor: 'black', height: '1px', width: '100%'}}></Container>
            <Container style={{
                display: "flex",
                width: "1280px",
                flexDirection: "column",
                margin: "0 auto",
                justifyContent: 'space-between',
            }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignContent: 'left'}}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignContent: 'left'}}>
                        <div className={styles.courseTitle}>
                            {courseTitle}
                        </div>
                    </div>
                    <WeekCard weekTitle="Week 1">
                        <LessonCard courseId={id} img={QULogo} lessonTitle="Lesson 1" lessonDesc="This is Lesson 1" lessonID={0}></LessonCard>
                        <LessonCard courseId={id} img={QULogo} lessonTitle="Lesson 2" lessonDesc="This is Lesson 2" lessonID={1}></LessonCard>
                    </WeekCard>
                    <WeekCard weekTitle="Week 2">
                        <LessonCard courseId={id} img={QULogo} lessonTitle="Lesson 1" lessonDesc="This is Lesson 1" lessonID={2}></LessonCard>
                        <LessonCard courseId={id} img={QULogo} lessonTitle="Lesson 2" lessonDesc="This is Lesson 2" lessonID={3}></LessonCard>
                        <LessonCard courseId={id} img={QULogo} lessonTitle="Lesson 3" lessonDesc="This is Lesson 3" lessonID={4}></LessonCard>
                    </WeekCard>
                </div>
            </Container>
        </>
    )
}
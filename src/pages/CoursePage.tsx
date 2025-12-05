import { useEffect, useState } from "react";
import { NavBar } from "../components/NavBar";
import { Button, Container } from "react-bootstrap";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { WeekCard } from "../components/WeekCard";
import { LessonCard } from "../components/LessonCard";
import QULogo from '../assets/qu-logo.png'
import styles from './CoursePage.module.css';

export default function CoursePage() {
    console.log("Clicked")
    const location = useLocation();
    const { courseTitle } = location.state || {};
    const { profName } = location.state || {}; 
    const { courseNum } = location.state || {};
    const curWeek = 3; //Determines which lessons are and aren't viewable
    /*
    Two Options here:
     - One, have the lessons themselves ask this object if they're one of the living ones, if yes, unlock, else ock
     - Two, have this class set the lessons premptively by running the check for all of them and updating a boolean
     - The main issue, which option is more elegant/later on expandable of a solution?
    */ 
   //Ik I could've just generated this with Arrays.from, but I did it this way in case for whatever reason hell opens up and u need to have
   //More than 2 lessons in a week
   const weeks = [
    {week: 1, lessons: [0, 1]}, 
    {week: 2, lessons: [2, 3]}, 
    {week: 3, lessons: [4, 5]}, 
    {week: 4, lessons: [6, 7]}, 
    {week: 5, lessons: [8, 9]}, 
    {week: 6, lessons: [10, 11]}, 
    {week: 7, lessons: [12, 13]}, 
    {week: 8, lessons: [14, 15]}, 
    {week: 9, lessons: [16, 17]}, 
    {week: 10, lessons: [18, 19]}, 
    {week: 11, lessons: [20, 21]}, 
    {week: 12, lessons: [22, 23]}, 
   ]

    const { id } = useParams();

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
            <Button variant="link" className={`${styles.backButton}`} onClick={handleBack} aria-label="Go back">←</Button>
            <Container style={{display: 'flex', backgroundColor: 'black', height: '1px', width: '100%'}}></Container>
            <Container style={{
                display: "flex",
                width: "1280px",
                flexDirection: "column",
                margin: "0 auto",
                justifyContent: 'space-between',
            }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignContent: 'left'}}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', alignContent: 'left'}}>
                        <div className={styles.courseTitle}> {courseTitle}</div>
                        <div className={styles.smallText}>{profName}</div>
                        <div className={styles.smallText}>{courseNum}</div>
                    </div>
                        {weeks
                        .filter((w) => w.week <= curWeek)
                        .map((w) => (
                            <WeekCard key={w.week} weekTitle={`Week ${w.week}`}>
                                {w.lessons.map((id) => (
                                    <LessonCard
                                        key={id}
                                        courseId={id.toString()}
                                        img={QULogo}
                                        lessonTitle={`Lesson ${id % 2 + 1}`}
                                        lessonDesc={`This is Lesson ${id % 2 + 1}`}
                                        lessonID={id}
                                        isLocked={false}
                                    />
                                ))}
                            </WeekCard>
                        ))}
                    {/*I think all sucks and is bad and sucks and better way exists... I think (I also barely know this language so I may be wrong so I leave comment)*/}
                    {/* <WeekCard weekTitle="Week 1">
                        <LessonCard courseId={id} img={QULogo} lessonTitle="Lesson 1" lessonDesc="This is Lesson 1" lessonID={0} isLocked={false}></LessonCard>
                        <LessonCard courseId={id} img={QULogo} lessonTitle="Lesson 2" lessonDesc="This is Lesson 2" lessonID={1} isLocked={false}></LessonCard>
                    </WeekCard>
                    <WeekCard weekTitle="Week 2">
                        <LessonCard courseId={id} img={QULogo} lessonTitle="Lesson 1" lessonDesc="This is Lesson 1" lessonID={2} isLocked={false}></LessonCard>
                        <LessonCard courseId={id} img={QULogo} lessonTitle="Lesson 2" lessonDesc="This is Lesson 2" lessonID={3} isLocked={false}></LessonCard>
                    </WeekCard>
                    <WeekCard weekTitle="Week 3">
                        <LessonCard courseId={id} img={QULogo} lessonTitle="Lesson 1" lessonDesc="This is Lesson 1" lessonID={2} isLocked={false}></LessonCard>
                        <LessonCard courseId={id} img={QULogo} lessonTitle="Lesson 2" lessonDesc="This is Lesson 2" lessonID={3} isLocked={false}></LessonCard>
                    </WeekCard>
                    <WeekCard weekTitle="Week 4">
                        <LessonCard courseId={id} img={QULogo} lessonTitle="Lesson 1" lessonDesc="This is Lesson 1" lessonID={4} isLocked={false}></LessonCard>
                        <LessonCard courseId={id} img={QULogo} lessonTitle="Lesson 2" lessonDesc="This is Lesson 2" lessonID={5} isLocked={false}></LessonCard>
                    </WeekCard>
                    <WeekCard weekTitle="Week 5">
                        <LessonCard courseId={id} img={QULogo} lessonTitle="Lesson 1" lessonDesc="This is Lesson 1" lessonID={6} isLocked={false}></LessonCard>
                        <LessonCard courseId={id} img={QULogo} lessonTitle="Lesson 2" lessonDesc="This is Lesson 2" lessonID={7} isLocked={false}></LessonCard>
                    </WeekCard>
                    <WeekCard weekTitle="Week 6">
                        <LessonCard courseId={id} img={QULogo} lessonTitle="Lesson 1" lessonDesc="This is Lesson 1" lessonID={8} isLocked={false}></LessonCard>
                        <LessonCard courseId={id} img={QULogo} lessonTitle="Lesson 2" lessonDesc="This is Lesson 2" lessonID={9} isLocked={false}></LessonCard>
                    </WeekCard>
                    <WeekCard weekTitle="Week 7">
                        <LessonCard courseId={id} img={QULogo} lessonTitle="Lesson 1" lessonDesc="This is Lesson 1" lessonID={10} isLocked={false}></LessonCard>
                        <LessonCard courseId={id} img={QULogo} lessonTitle="Lesson 2" lessonDesc="This is Lesson 2" lessonID={11} isLocked={false}></LessonCard>
                    </WeekCard>
                    <WeekCard weekTitle="Week 8">
                        <LessonCard courseId={id} img={QULogo} lessonTitle="Lesson 1" lessonDesc="This is Lesson 1" lessonID={12} isLocked={false}></LessonCard>
                        <LessonCard courseId={id} img={QULogo} lessonTitle="Lesson 2" lessonDesc="This is Lesson 2" lessonID={13} isLocked={false}></LessonCard>
                    </WeekCard>
                    <WeekCard weekTitle="Week 9">
                        <LessonCard courseId={id} img={QULogo} lessonTitle="Lesson 1" lessonDesc="This is Lesson 1" lessonID={14} isLocked={false}></LessonCard>
                        <LessonCard courseId={id} img={QULogo} lessonTitle="Lesson 2" lessonDesc="This is Lesson 2" lessonID={15} isLocked={false}></LessonCard>
                    </WeekCard>
                    <WeekCard weekTitle="Week 10">
                        <LessonCard courseId={id} img={QULogo} lessonTitle="Lesson 1" lessonDesc="This is Lesson 1" lessonID={16} isLocked={false}></LessonCard>
                        <LessonCard courseId={id} img={QULogo} lessonTitle="Lesson 2" lessonDesc="This is Lesson 2" lessonID={17} isLocked={false}></LessonCard>
                    </WeekCard>
                    <WeekCard weekTitle="Week 11">
                        <LessonCard courseId={id} img={QULogo} lessonTitle="Lesson 1" lessonDesc="This is Lesson 1" lessonID={18} isLocked={false}></LessonCard>
                        <LessonCard courseId={id} img={QULogo} lessonTitle="Lesson 2" lessonDesc="This is Lesson 2" lessonID={19} isLocked={false}></LessonCard>
                    </WeekCard>
                    <WeekCard weekTitle="Week 12">
                        <LessonCard courseId={id} img={QULogo} lessonTitle="Lesson 1" lessonDesc="This is Lesson 1" lessonID={20} isLocked={false}></LessonCard>
                        <LessonCard courseId={id} img={QULogo} lessonTitle="Lesson 2" lessonDesc="This is Lesson 2" lessonID={21} isLocked={false}></LessonCard>
                    </WeekCard>
                    <WeekCard weekTitle="Week 13">
                        <LessonCard courseId={id} img={QULogo} lessonTitle="Lesson 1" lessonDesc="This is Lesson 1" lessonID={22} isLocked={false}></LessonCard>
                        <LessonCard courseId={id} img={QULogo} lessonTitle="Lesson 2" lessonDesc="This is Lesson 2" lessonID={23} isLocked={false}></LessonCard>
                    </WeekCard>
                    <WeekCard weekTitle="Week 14">
                        <LessonCard courseId={id} img={QULogo} lessonTitle="Lesson 1" lessonDesc="This is Lesson 1" lessonID={24} isLocked={false}></LessonCard>
                        <LessonCard courseId={id} img={QULogo} lessonTitle="Lesson 2" lessonDesc="This is Lesson 2" lessonID={25} isLocked={false}></LessonCard>
                    </WeekCard> */}
                </div>
            </Container>
        </>
    )
}
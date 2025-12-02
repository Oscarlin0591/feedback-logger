import { useState, useEffect } from "react"
import { Card, CardBody, CardImg, CardText, CardTitle, Col, Row } from "react-bootstrap"
import { useNavigate } from "react-router-dom"
import styles from './LessonCard.module.css';

export function LessonCard(props : {
    img:string,
    lessonTitle:string,
    lessonDesc:string,
    lessonID:number,
    courseId?: string | undefined
}) {
    const navigate = useNavigate();

    const courseSegment = props.courseId ? `/course/${props.courseId}` : ''

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <Card className={styles.Card} onClick={() => navigate(`${courseSegment}/lesson/${props.lessonID}`)}>
                <div className={styles.lessonRow}>
                    <CardImg src={props.img} className={styles.lessonImg} />
                    <div className={styles.textArea}>
                        <CardTitle className={styles.lessonTitle}>
                            {props.lessonTitle}
                        </CardTitle>
                        <CardText className={styles.lessonDesc}>
                            {props.lessonDesc}
                        </CardText>
                    </div>
                </div>
            </Card>
        </div>
    )
}
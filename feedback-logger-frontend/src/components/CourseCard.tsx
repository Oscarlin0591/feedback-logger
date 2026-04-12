import { useState, useEffect } from "react"
import { Card, CardBody, CardImg, CardText, CardTitle } from "react-bootstrap"
import { Link, useNavigate } from "react-router-dom"
import styles from './CourseCard.module.css';

export function CourseCard(props : {img:string, courseTitle:string, courseDescription:string, courseNum:string, profName:string}){

    const navigate = useNavigate();

    return (
        <>
            {/* Card component that links to /course and the coursenum as parameters */}
            <Card className={styles.Card} onClick={() => navigate(`/course/${props.courseNum}`, {
                state: {courseTitle: props.courseTitle, profName: props.profName, courseNum: props.courseNum}
            })}>
                <CardImg variant="top" src={props.img} style={{width: "100%"}}/>
                <CardBody style={{padding: "8px 4px"}}>
                    <CardTitle style={{fontWeight: 500, textAlign: "center"}}>{props.courseTitle}</CardTitle>
                    <CardText style={{textAlign: "center"}}>{props.courseDescription}</CardText>
                </CardBody>
            </Card>
        </>
    )
}
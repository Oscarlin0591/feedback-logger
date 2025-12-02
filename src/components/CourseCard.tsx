import { useState, useEffect } from "react"
import { Card, CardBody, CardImg, CardText, CardTitle } from "react-bootstrap"
import { Link, useNavigate } from "react-router-dom"
import styles from './CourseCard.module.css';

export function CourseCard(props : {img:string, courseTitle:string, courseDescription:string, courseNum:number}){

    const navigate = useNavigate();

    return (
        <>
            {/* <Link to={`/course?courseNum=${props.courseNum.toString()}`}> */}
                <Card className={styles.Card} onClick={() => navigate({
                    pathname: `/course/${props.courseNum}`
                })}>
                    <CardImg variant="top" src={props.img} style={{width: "100%"}}/>
                    <CardBody style={{padding: "8px 4px"}}>
                        <CardTitle style={{fontWeight: 500, textAlign: "center"}}>{props.courseTitle}</CardTitle>
                        <CardText style={{textAlign: "center"}}>{props.courseDescription}</CardText>
                    </CardBody>
                </Card>
            {/* </Link> */}
        </>
    )
}
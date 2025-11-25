import { useState, useEffect } from "react"
import { Card, CardBody, CardImg, CardText, CardTitle } from "react-bootstrap"

export function CourseCard(props : {img:string, courseTitle:string, courseDescription:string}){

    return (
        <>
            <Card style={{
                display: "flex", 
                flexDirection: "column" , 
                width: "20rem", 
                border: "1px solid black", 
                margin: "12px",
                padding: "8px", 
                alignItems: "center"
                }}>
                <CardImg variant="top" src={props.img} style={{width: "480px"}}/>
                <CardBody style={{padding: "8px 4px"}}>
                    <CardTitle style={{fontWeight: 500, textAlign: "center"}}>{props.courseTitle}</CardTitle>
                    <CardText style={{textAlign: "center"}}>{props.courseDescription}</CardText>
                </CardBody>
            </Card>
        </>
    )
}
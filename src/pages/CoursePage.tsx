import { useEffect, useState } from "react";
import { NavBar } from "../components/NavBar";
import { Container } from "react-bootstrap";
import { useParams } from "react-router-dom";

export default function CoursePage() {
    console.log("Clicked")
    const [courseTitle, setCourseTitle] = useState('');
    const { courseNum } = useParams();

    
    return (
        <>
            <NavBar></NavBar>
            <Container>
                <h1>Course {courseNum}</h1>
            </Container>
        </>
    )
}
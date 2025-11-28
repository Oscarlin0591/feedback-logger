import { useState } from 'react'
import reactLogo from './assets/react.svg'
import QULogo from './assets/qu-logo.png'
// import './App.css'
import { Container } from 'react-bootstrap'
import { CourseCard } from './components/CourseCard'
import { NavBar } from './components/NavBar'

function App() {

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
        <CourseCard img={QULogo} courseTitle={'Course 1'} courseDescription={'Description of Course 1'} courseNum={1}/>
        <CourseCard img={QULogo} courseTitle={'Course 1'} courseDescription={'Description of Course 1'} courseNum={2}/>
        <CourseCard img={QULogo} courseTitle={'Course 1'} courseDescription={'Description of Course 1'} courseNum={3}/>
        <CourseCard img={QULogo} courseTitle={'Course 1'} courseDescription={'Description of Course 1'} courseNum={4}/>
     </Container>
    </>
  )
}

export default App;

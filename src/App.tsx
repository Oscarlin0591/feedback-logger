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
        <CourseCard img={QULogo} courseTitle={'Course 1'} courseDescription={'Description of Course 1'} />
        <CourseCard img={QULogo} courseTitle={'Course 1'} courseDescription={'Description of Course 1'} />
        <CourseCard img={QULogo} courseTitle={'Course 1'} courseDescription={'Description of Course 1'} />
        <CourseCard img={QULogo} courseTitle={'Course 1'} courseDescription={'Description of Course 1'} />
    </Container>
      {/* <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p> */}
    </>
  )
}

export default App

import { useState } from 'react'
import reactLogo from './assets/react.svg'
import QULogo from './assets/qu-logo.png'
// import './App.css'
import { Container, Nav, Navbar, NavbarBrand, NavLink, Row } from 'react-bootstrap'
import { CourseCard } from './components/CourseCard'

function App() {

  return (
    <>
    <Navbar>
      <NavbarBrand href="#home">
        <img src="./assets/react.svg"/>
      </NavbarBrand>
      <NavLink>Log out</NavLink>
    </Navbar>
    <Container style={{
      display: "flex",
      width: "1280px",
      flexDirection: "row",
      flexWrap: "wrap"
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

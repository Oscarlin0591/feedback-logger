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
        <CourseCard img={QULogo} courseTitle={'Course 1'} courseDescription={'Description of Course 1'} courseNum='MA-229' profName={'Professor Johnson'}/>
        <CourseCard img={QULogo} courseTitle={'Course 2'} courseDescription={'Description of Course 2'} courseNum='SER-340' profName={'Professor Shah'}/>
        <CourseCard img={QULogo} courseTitle={'Course 3'} courseDescription={'Description of Course 3'} courseNum='CSC-310' profName={'Professor Blake'}/>
        <CourseCard img={QULogo} courseTitle={'Course 4'} courseDescription={'Description of Course 4'} courseNum='CSC-340' profName={'Professor ElKharboutly'}/>
     </Container>
    </>
  )
}

export default App;

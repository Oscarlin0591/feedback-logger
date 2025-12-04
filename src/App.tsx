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
        <CourseCard img={QULogo} courseTitle={'MA-229'} courseDescription={'Applied Statistics'} courseNum='MA-229' profName={'Professor Johnson'}/>
        <CourseCard img={QULogo} courseTitle={'SER-325'} courseDescription={'Databases Systems'} courseNum='SER-325' profName={'Professor Shah'}/>
        <CourseCard img={QULogo} courseTitle={'CSC-310'} courseDescription={'Operating Systems'} courseNum='CSC-310' profName={'Professor Blake'}/>
        <CourseCard img={QULogo} courseTitle={'CSC-340'} courseDescription={'Full Stack Development'} courseNum='CSC-340' profName={'Professor ElKharboutly'}/>
     </Container>
    </>
  )
}

export default App;

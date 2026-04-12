import { Container, Image, Navbar, NavbarBrand, NavLink } from "react-bootstrap";
import Logo from "../assets/contact-form.png"
import styles from './NavBar.module.css';
import defaultImage from "../../public/default-avatar.jpg"


export const NavBar = () => {

    return (
        <Navbar className={styles.NavBar}>
            <Container>
                <NavbarBrand href="/main" className={styles.NavBrand}>
                <img width='48' height='48' className={styles.logo} src={Logo}/>
                {/* Brandon, Oscar, and Brady's Feedback Logger */}
                BOB's Feedback Logger
                </NavbarBrand>
            </Container>
            <NavLink style={{margin: 'auto 8px'}} href="profile"><Image src={defaultImage} className={styles.icon}/></NavLink>
            <NavLink className={styles.NavLink} href="/" onClick={() => { localStorage.removeItem('role') }}>Log out</NavLink>
        </Navbar>);
    }
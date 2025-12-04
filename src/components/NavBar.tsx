import { Container, Navbar, NavbarBrand, NavLink } from "react-bootstrap";
import Logo from "../assets/contact-form.png"
import styles from './NavBar.module.css';


export const NavBar = () => {

    return (
        <Navbar className={styles.NavBar}>
            <Container>
                <NavbarBrand href="/main" className={styles.NavBrand}>
                <img width='48' height='48' className={styles.logo} src={Logo}/>
                </NavbarBrand>
            </Container>
            <NavLink className={styles.NavLink} href="profile">Profile</NavLink>
            <NavLink className={styles.NavLink} href="/" onClick={() => { localStorage.removeItem('role') }}>Log out</NavLink>
        </Navbar>);
    }
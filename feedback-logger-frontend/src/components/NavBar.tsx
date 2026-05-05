import { Container, Image, Navbar, NavbarBrand, NavLink } from "react-bootstrap";
import Logo from "../assets/contact-form.png"
import styles from './NavBar.module.css';
import defaultImage from "../../public/default-avatar.jpg"
import { useEffect, useState } from "react";

export const NavBar = () => {
    const [name, setName] = useState<string | null>(null);
    const [avatar, setAvatar] = useState<string>(defaultImage);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) return;

        fetch('/api/auth/user', { headers: { Authorization: `Bearer ${token}` } })
            .then((r) => r.json())
            .then((data) => {
                if (data.name) setName(data.name);
                if (data.profileImage) setAvatar(data.profileImage);
            });
    }, []);

    return (
        <Navbar className={styles.NavBar}>
            <Container>
                <NavbarBrand href="/main" className={styles.NavBrand}>
                <img width='48' height='48' className={styles.logo} src={Logo}/>
                {/* Brandon, Oscar, and Brady's Feedback Logger */}
                BOB's Feedback Logger
                </NavbarBrand>
            </Container>
            <NavLink style={{margin: 'auto 8px', display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none', color: 'inherit'}} href="/profile">
                <Image src={avatar} className={styles.icon}/>
                {name && <span style={{fontWeight: 500}}>{name}</span>}
            </NavLink>
            <NavLink className={styles.NavLink} href="/" onClick={() => { localStorage.removeItem('token'); localStorage.removeItem('role'); }}>Log out</NavLink>
        </Navbar>);
    }
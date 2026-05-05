import { Container, Row, Col, Image, Button, Form } from "react-bootstrap"
import { NavBar } from "../components/NavBar"
import styles from "./Profile.module.css"
import defaultImage from "../../public/default-avatar.jpg"
import { useEffect, useState } from "react";

interface User {
    name: string,
    classYear: number | null,
    major: string,
    department: string,
    role: string,
    email: string,
    profileImage: string
}

export default function Profile() {
    const [user, setUser] = useState<User>()
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState<User | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) return;

        fetch('/api/auth/user', { headers: { Authorization: `Bearer ${token}` } })
            .then((r) => r.json())
            .then((data: User) => {
                const loaded: User = {
                    name: data.name ?? '',
                    email: data.email ?? '',
                    role: data.role ?? '',
                    classYear: data.classYear ?? null,
                    major: data.major ?? '',
                    department: data.department ?? '',
                    profileImage: data.profileImage || defaultImage,
                };
                setUser(loaded);
                setEditForm(loaded);
            });
    }, []);

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onloadend = () => {
            const dataUrl = String(reader.result);
            setEditForm((f) => f ? { ...f, profileImage: dataUrl } : f);
            setUser((u) => u ? { ...u, profileImage: dataUrl } : u);
        };
        reader.readAsDataURL(file);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!editForm) return;
        const { name, value } = e.target;
        setEditForm({ ...editForm, [name]: value });
    };

    const saveChanges = () => {
        if (!editForm) return;
        const token = localStorage.getItem('token');
        fetch('/api/auth/user', {
            method: 'PUT',
            headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
            body: JSON.stringify(editForm),
        })
            .then((r) => r.json())
            .then((data: User) => {
                setUser({ ...data, profileImage: data.profileImage || defaultImage });
                setIsEditing(false);
            });
    };

    return (
        <>
            <NavBar />

            <Container className={styles.pageBody}>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <section id="about">
                    <Row className="align-items-center flex-row-reverse">
                        <Col lg={6}>
                            <h3 className="text-dark">Profile</h3>
                            <Row>
                                <Col md={6}>
                                    <Form.Group className="mb-2">
                                        <Form.Label className="fw-bold">Name</Form.Label>
                                        {isEditing ? (
                                            <Form.Control
                                                name="name"
                                                value={editForm?.name}
                                                onChange={handleChange}
                                            />
                                        ) : (
                                            <p>{user?.name}</p>
                                        )}
                                    </Form.Group>

                                    <Form.Group className="mb-2">
                                        <Form.Label className="fw-bold">Class Year</Form.Label>
                                        {isEditing ? (
                                            <Form.Control
                                                name="classYear"
                                                value={editForm?.classYear ?? ""}
                                                onChange={handleChange}
                                            />
                                        ) : (
                                            <p>{user?.classYear}</p>
                                        )}
                                    </Form.Group>

                                    <Form.Group className="mb-2">
                                        <Form.Label className="fw-bold">Major</Form.Label>
                                        {isEditing ? (
                                            <Form.Control
                                                name="major"
                                                value={editForm?.major}
                                                onChange={handleChange}
                                            />
                                        ) : (
                                            <p>{user?.major}</p>
                                        )}
                                    </Form.Group>
                                </Col>

                                <Col md={6}>
                                    <Form.Group className="mb-2">
                                        <Form.Label className="fw-bold">Department</Form.Label>
                                        {isEditing ? (
                                            <Form.Control
                                                name="department"
                                                value={editForm?.department}
                                                onChange={handleChange}
                                            />
                                        ) : (
                                            <p>{user?.department}</p>
                                        )}
                                    </Form.Group>

                                    <Form.Group className="mb-2">
                                        <Form.Label className="fw-bold">Email</Form.Label>
                                        <p>{user?.email}</p>
                                    </Form.Group>
                                </Col>
                            </Row>

                            {isEditing ? (
                                <Button className="mt-3" onClick={saveChanges}>
                                    Save Changes
                                </Button>
                            ) : (
                                <Button className="mt-3" onClick={() => setIsEditing(true)}>
                                    Edit Profile
                                </Button>
                            )}
                        </Col>

                        {/* RIGHT — AVATAR */}
                        <Col lg={6} className="text-center">
                            <div className="d-flex flex-column align-items-center">
                                <Image
                                    src={user?.profileImage || defaultImage}
                                    roundedCircle
                                    fluid
                                    className="shadow-sm mb-3"
                                    style={{
                                        width: "220px",
                                        height: "220px",
                                        objectFit: "cover",
                                    }}
                                />

                                {isEditing && (
                                    <label className="btn btn-primary mt-2">
                                        Upload New Photo
                                        <input
                                            type="file"
                                            accept="image/*"
                                            hidden
                                            onChange={handleImageUpload}
                                        />
                                    </label>
                                )}
                            </div>
                        </Col>
                    </Row>
                </section>
            </Container>
        </>
    )
}

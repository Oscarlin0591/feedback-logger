import { Container, Row, Col, Image, Button, Form } from "react-bootstrap"
import { NavBar } from "../components/NavBar"
import styles from "./Profile.module.css"
import defaultImage from "../../public/default-avatar.jpg"
import { useEffect, useState } from "react";
import { apiGet, apiPut } from "../api";
import type { ApiUser } from "../types";

export default function Profile() {
    const [profileImage, setProfileImage] = useState<string>(defaultImage);
    const [user, setUser] = useState<ApiUser | undefined>();
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState<ApiUser | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        apiGet<ApiUser>('/profile')
            .then((data) => {
                setUser(data);
                setEditForm(data);
                if (data.profileImage && data.profileImage !== '/default-avatar.jpg') {
                    setProfileImage(data.profileImage);
                }
            })
            .catch(() => setError('Failed to load profile. Is the backend running?'));
    }, []);

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfileImage(String(reader.result));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!editForm) return;
        const { name, value } = e.target;
        setEditForm({ ...editForm, [name]: value } as ApiUser);
    };

    const saveChanges = () => {
        if (!editForm) return;
        apiPut<ApiUser>('/profile', {
            name: editForm.name,
            classYear: editForm.classYear !== null ? Number(editForm.classYear) : null,
            major: editForm.major,
            department: editForm.department,
        })
            .then((updated) => {
                setUser(updated);
                setEditForm(updated);
                setIsEditing(false);
            })
            .catch(() => setError('Failed to save changes'));
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
                                    src={profileImage || defaultImage}
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

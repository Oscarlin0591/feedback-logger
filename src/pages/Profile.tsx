import { Container, Row, Col, Image, Button, Form } from "react-bootstrap"
import { NavBar } from "../components/NavBar"
import styles from "./Profile.module.css"
import defaultImage from "../../public/default-avatar.jpg"
import { useEffect, useState } from "react";
import profiles from "../users.json";

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
    const [profileImage, setProfileImage] = useState<string | null>(defaultImage);
    const [user, setUser] = useState<User>()
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState<User | null>(null);

    const role = localStorage.getItem('role')

    useEffect(() => {
        let selectedUser: User;

        // loads user info based off of whether user is student or admin
        if (role === 'admin') {
            selectedUser = profiles[1];
        } else if (role === 'student') {
            selectedUser = profiles[0];
        } else {
            selectedUser = profiles[0];
        }
        
        setUser(selectedUser);
        setProfileImage(user?.profileImage!)
        setEditForm(selectedUser)
    }, [role])

    // image upload fucntionality
    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) { // filereader class takes img string and read the pathed image file
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfileImage(String(reader.result));
            };
            reader.readAsDataURL(file);
        }
    };

    // live update on value changes
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!editForm) return;
        const { name, value } = e.target;
        setEditForm({ ...editForm, [name]: value });
    };

    const saveChanges = () => {
        if (!editForm) return;
        setUser(editForm); // update UI only
        setIsEditing(false);
    };

    return (
        <>
            <NavBar />

            <Container className={styles.pageBody}>
                <section id="about">
                    <Row className="align-items-center flex-row-reverse">
                        <Col lg={6}>
                            <h3 className="text-dark">Profile</h3>
                            <Row>
                                <Col md={6}>
                                    <Form.Group className="mb-2">
                                        <Form.Label className="fw-bold">Name</Form.Label>
                                        {/* editing ternary to display form when isEdit is true and p tag when false, overlays for all fields */}
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
                                        {isEditing ? (
                                            <Form.Control
                                                name="email"
                                                value={editForm?.email}
                                                onChange={handleChange}
                                            />
                                        ) : (
                                            <p>{user?.email}</p>
                                        )}
                                    </Form.Group>
                                </Col>
                            </Row>

                            {/* Save / Edit buttons */}
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

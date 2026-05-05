import { useState, type ChangeEvent, type FormEvent } from "react";
import { Button, Container, Form, Modal } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "./Login.css";

interface FormData {
    email: string;
    password: string;
    role: 'student' | 'professor';
}

interface PassChange {
    email: string;
    newPass: string;
    repass: string;
    role: 'student' | 'professor';
}

function Login() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState<FormData>({ email: '', password: '', role: 'student' });
    const [newPass, setNewPass] = useState<PassChange>({ email: '', newPass: '', repass: '', role: 'student' });
    const [show, setShow] = useState(false);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setNewPass((prev) => ({ ...prev, [name]: value }));
    };

    const handlePassSubmit = async (e: FormEvent) => {
        e.preventDefault();

        if (newPass.newPass !== newPass.repass) {
            alert("Passwords do not match");
            return;
        }

        // Log in first to get a token for the change-password request
        const loginRes = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: newPass.email, password: formData.password, role: newPass.role }),
        });

        if (!loginRes.ok) {
            alert("Could not verify identity. Please log in first.");
            return;
        }

        const { token } = await loginRes.json() as { token: string };

        const res = await fetch('/api/auth/change-password', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({ newPassword: newPass.newPass }),
        });

        const data = await res.json() as { message: string };

        if (!res.ok) {
            alert(data.message);
            return;
        }

        alert("Password successfully changed!");
        setNewPass({ email: '', newPass: '', repass: '' });
        setShow(false);
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        const res = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: formData.email, password: formData.password, role: formData.role }),
        });

        if (!res.ok) {
            alert("Invalid login");
            return;
        }

        const data = await res.json() as { token: string; role: string };
        localStorage.setItem('token', data.token);
        localStorage.setItem('role', data.role);
        navigate({ pathname: "main" });
    };

    return (
        <>
            <Container className="pageBody">
                <h1>Login</h1>
                <Form className="form" onSubmit={handleSubmit}>
                    <Form.Group className="mb-3 formGroup" controlId="formGroupEmail">
                        <Form.Label>Email address:</Form.Label>
                        <Form.Control className="formInput" type="email" name="email" placeholder="Enter email" value={formData.email} onChange={handleChange} />
                    </Form.Group>
                    <Form.Group className="mb-3 formGroup" controlId="formGroupPassword">
                        <Form.Label>Password:</Form.Label>
                        <Form.Control className="formInput" type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} />
                    </Form.Group>
                    <Form.Group className="mb-3 formGroup" controlId="formGroupRole">
                        <Form.Label>Role:</Form.Label>
                        <Form.Select name="role" value={formData.role} onChange={(e) => setFormData((prev) => ({ ...prev, role: e.target.value as FormData['role'] }))}>
                            <option value="student">Student</option>
                            <option value="professor">Professor</option>
                        </Form.Select>
                    </Form.Group>
                    <Button className="button" variant="primary" type="submit">
                        Sign In
                    </Button>
                </Form>

                <Container className="passBody">
                    <h2>Forgot Password?:</h2>
                    <Button onClick={() => setShow(true)}>Change Password</Button>
                </Container>

                <Modal show={show} onHide={() => { setNewPass({ email: '', newPass: '', repass: '', role: 'student' }); setShow(false); }} centered>
                    <Modal.Header closeButton>
                        <Modal.Title>Change Password</Modal.Title>
                    </Modal.Header>
                    <Form onSubmit={handlePassSubmit}>
                        <Modal.Body>
                            <Form.Group className="mb-3">
                                <Form.Label>Email</Form.Label>
                                <Form.Control type="email" name="email" placeholder="Enter Email" value={newPass.email} onChange={handlePasswordChange} required />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>New Password</Form.Label>
                                <Form.Control type="password" name="newPass" placeholder="New Password" value={newPass.newPass} onChange={handlePasswordChange} required />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Re-enter Password</Form.Label>
                                <Form.Control type="password" name="repass" placeholder="Re-enter Password" value={newPass.repass} onChange={handlePasswordChange} required />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Role</Form.Label>
                                <Form.Select name="role" value={newPass.role} onChange={(e) => setNewPass((prev) => ({ ...prev, role: e.target.value as PassChange['role'] }))}>
                                    <option value="student">Student</option>
                                    <option value="professor">Professor</option>
                                </Form.Select>
                            </Form.Group>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={() => { setNewPass({ email: '', newPass: '', repass: '', role: 'student' }); setShow(false); }}>
                                Close
                            </Button>
                            <Button type="submit" variant="primary">
                                Save Changes
                            </Button>
                        </Modal.Footer>
                    </Form>
                </Modal>
            </Container>
        </>
    );
}

export default Login;

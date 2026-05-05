import { useState, type ChangeEvent, type FormEvent } from "react";
import { Alert, Button, Container, Form, Modal, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import "./Login.css";

const loginSchema = z.object({
    email: z.string().email("Enter a valid email address"),
    password: z.string().min(1, "Password is required"),
});

const registerSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Enter a valid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
    role: z.enum(['student', 'professor']),
}).refine((d) => d.password === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});

const changePassSchema = z.object({
    email: z.string().email("Enter a valid email address"),
    newPass: z.string().min(6, "Password must be at least 6 characters"),
    repass: z.string().min(1, "Please confirm your password"),
}).refine((d) => d.newPass === d.repass, {
    message: "Passwords do not match",
    path: ["repass"],
});

type FieldErrors<T> = Partial<Record<keyof T, string>>;

interface FormData {
    email: string;
    password: string;
}

interface PassChange {
    email: string;
    newPass: string;
    repass: string;
}

function Login() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState<FormData>({ email: '', password: '' });
    const [loginErrors, setLoginErrors] = useState<FieldErrors<FormData>>({});

    const [newPass, setNewPass] = useState<PassChange>({ email: '', newPass: '', repass: '' });
    const [changePassErrors, setChangePassErrors] = useState<FieldErrors<PassChange>>({});
    const [show, setShow] = useState(false);

    const [registerData, setRegisterData] = useState({ name: '', email: '', password: '', confirmPassword: '', role: 'student' as 'student' | 'professor' });
    const [registerErrors, setRegisterErrors] = useState<FieldErrors<typeof registerData>>({});
    const [showRegister, setShowRegister] = useState(false);
    const [registerSuccess, setRegisterSuccess] = useState(false);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        setLoginErrors((prev) => ({ ...prev, [name]: undefined }));
    };

    const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setNewPass((prev) => ({ ...prev, [name]: value }));
        setChangePassErrors((prev) => ({ ...prev, [name]: undefined }));
    };

    const handlePassSubmit = async (e: FormEvent) => {
        e.preventDefault();

        const validation = changePassSchema.safeParse(newPass);
        if (!validation.success) {
            const errs: FieldErrors<PassChange> = {};
            for (const issue of validation.error.issues) {
                const key = issue.path[0] as keyof PassChange;
                if (!errs[key]) errs[key] = issue.message;
            }
            setChangePassErrors(errs);
            return;
        }
        setChangePassErrors({});

        // Log in first to get a token for the change-password request
        const loginRes = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: newPass.email, password: formData.password }),
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

    const handleRegisterChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setRegisterData((prev) => ({ ...prev, [name]: value }));
        setRegisterErrors((prev) => ({ ...prev, [name]: undefined }));
    };

    const handleRegisterSubmit = async (e: FormEvent) => {
        e.preventDefault();

        const validation = registerSchema.safeParse(registerData);
        if (!validation.success) {
            const errs: FieldErrors<typeof registerData> = {};
            for (const issue of validation.error.issues) {
                const key = issue.path[0] as keyof typeof registerData;
                if (!errs[key]) errs[key] = issue.message;
            }
            setRegisterErrors(errs);
            return;
        }
        setRegisterErrors({});

        const { confirmPassword: _omit, ...payload } = validation.data;
        const res = await fetch('/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });

        const data = await res.json() as { message: string };
        if (!res.ok) {
            setRegisterErrors({ email: data.message });
            return;
        }

        setRegisterData({ name: '', email: '', password: '', confirmPassword: '', role: 'student' });
        setShowRegister(false);
        setRegisterSuccess(true);
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        const validation = loginSchema.safeParse(formData);
        if (!validation.success) {
            const errs: FieldErrors<FormData> = {};
            for (const issue of validation.error.issues) {
                const key = issue.path[0] as keyof FormData;
                if (!errs[key]) errs[key] = issue.message;
            }
            setLoginErrors(errs);
            return;
        }
        setLoginErrors({});

        const res = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: formData.email, password: formData.password }),
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
                {registerSuccess && (
                    <Alert variant="success" dismissible onClose={() => setRegisterSuccess(false)}>
                        Account created successfully! You can now sign in.
                    </Alert>
                )}
                <Form className="form" onSubmit={handleSubmit} noValidate>
                    <Form.Group className="mb-3 formGroup" controlId="formGroupEmail">
                        <Form.Label>Email address:</Form.Label>
                        <Form.Control className="formInput" type="email" name="email" placeholder="Enter email" value={formData.email} onChange={handleChange} isInvalid={!!loginErrors.email} />
                        <Form.Control.Feedback type="invalid">{loginErrors.email}</Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group className="mb-3 formGroup" controlId="formGroupPassword">
                        <Form.Label>Password:</Form.Label>
                        <Form.Control className="formInput" type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} isInvalid={!!loginErrors.password} />
                        <Form.Control.Feedback type="invalid">{loginErrors.password}</Form.Control.Feedback>
                    </Form.Group>
                    <Row>
                        <Button className="button" variant="primary" type="submit" style={{margin:"4px"}}>
                            Sign In
                        </Button>
                        <Button variant="secondary" style={{margin:"4px"}} onClick={() => setShowRegister(true)}>Create Account</Button>
                    </Row>
                </Form>

                <Container className="passBody">
                        <h2>Forgot Password?:</h2>
                        <Button onClick={() => setShow(true)}>Change Password</Button>
                </Container>

                <Modal show={show} onHide={() => { setNewPass({ email: '', newPass: '', repass: '' }); setShow(false); }} centered>
                    <Modal.Header closeButton>
                        <Modal.Title>Change Password</Modal.Title>
                    </Modal.Header>
                    <Form onSubmit={handlePassSubmit}>
                        <Modal.Body>
                            <Form.Group className="mb-3">
                                <Form.Label>Email</Form.Label>
                                <Form.Control type="email" name="email" placeholder="Enter Email" value={newPass.email} onChange={handlePasswordChange} isInvalid={!!changePassErrors.email} required />
                                <Form.Control.Feedback type="invalid">{changePassErrors.email}</Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>New Password</Form.Label>
                                <Form.Control type="password" name="newPass" placeholder="New Password" value={newPass.newPass} onChange={handlePasswordChange} isInvalid={!!changePassErrors.newPass} required />
                                <Form.Control.Feedback type="invalid">{changePassErrors.newPass}</Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Re-enter Password</Form.Label>
                                <Form.Control type="password" name="repass" placeholder="Re-enter Password" value={newPass.repass} onChange={handlePasswordChange} isInvalid={!!changePassErrors.repass} required />
                                <Form.Control.Feedback type="invalid">{changePassErrors.repass}</Form.Control.Feedback>
                            </Form.Group>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={() => { setNewPass({ email: '', newPass: '', repass: '' }); setShow(false); }}>
                                Close
                            </Button>
                            <Button type="submit" variant="primary">
                                Save Changes
                            </Button>
                        </Modal.Footer>
                    </Form>
                </Modal>
            </Container>
            {/* Create Account Modal */}
            <Modal show={showRegister} onHide={() => { setRegisterData({ name: '', email: '', password: '', confirmPassword: '', role: 'student' }); setRegisterErrors({}); setShowRegister(false); }} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Create Account</Modal.Title>
                </Modal.Header>
                <Form onSubmit={handleRegisterSubmit} noValidate>
                    <Modal.Body>
                        <Form.Group className="mb-3">
                            <Form.Label>Full Name</Form.Label>
                            <Form.Control type="text" name="name" placeholder="Enter your name" value={registerData.name} onChange={handleRegisterChange} isInvalid={!!registerErrors.name} required />
                            <Form.Control.Feedback type="invalid">{registerErrors.name}</Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Email</Form.Label>
                            <Form.Control type="email" name="email" placeholder="Enter email" value={registerData.email} onChange={handleRegisterChange} isInvalid={!!registerErrors.email} required />
                            <Form.Control.Feedback type="invalid">{registerErrors.email}</Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Password</Form.Label>
                            <Form.Control type="password" name="password" placeholder="Min. 6 characters" value={registerData.password} onChange={handleRegisterChange} isInvalid={!!registerErrors.password} required />
                            <Form.Control.Feedback type="invalid">{registerErrors.password}</Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Confirm Password</Form.Label>
                            <Form.Control type="password" name="confirmPassword" placeholder="Re-enter password" value={registerData.confirmPassword} onChange={handleRegisterChange} isInvalid={!!registerErrors.confirmPassword} required />
                            <Form.Control.Feedback type="invalid">{registerErrors.confirmPassword}</Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Role</Form.Label>
                            <Form.Select name="role" value={registerData.role} onChange={(e) => setRegisterData((prev) => ({ ...prev, role: e.target.value as 'student' | 'professor' }))}>
                                <option value="student">Student</option>
                                <option value="professor">Professor</option>
                            </Form.Select>
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => { setRegisterData({ name: '', email: '', password: '', confirmPassword: '', role: 'student' }); setRegisterErrors({}); setShowRegister(false); }}>Cancel</Button>
                        <Button type="submit" variant="primary">Create Account</Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </>
    );
}

export default Login;

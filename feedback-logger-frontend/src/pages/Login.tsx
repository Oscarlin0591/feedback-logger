import { useState, type ChangeEvent, type FormEvent } from "react";
import { Button, Container, Form, Modal } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "./Login.css";

interface FormData {
    email: string,
    password: string,
    password1: string
}

interface PassChange {
    newPass: string,
    repass: string
}

function Login() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState<FormData>({
        email: '',
        password: '',
        password1: '',
    });
    const [adminUser, setAdminUser] = useState('admin@qu.edu');
    const [adminPass, setAdminPass] = useState('password');
    const [studentUser, setStudentUser] = useState('user@qu.edu');
    const [studentPass, setStudentPass] = useState('password');
    const [newPass, setNewPass] = useState<PassChange>({
        newPass: '',
        repass: ''
    });
    const [show, setShow] = useState(false);

    // update form data to be submitted as user type in
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value} = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }))
    };

    // live update on password to be submitted as user types
    const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setNewPass(prev => {
        const updated = { ...prev, [name]: value };

        return updated;
    });
};

    const handlePassSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (newPass.newPass !== newPass.repass) {
        alert("Passwords do not match");
        return;
    }

    // Do not allow reusing the same password
    if (newPass.newPass === adminPass || newPass.newPass === studentPass) {
        alert("Password cannot be same as previous password!");
        return;
    }

    // Update passwords (temporary logic)
    setAdminPass(newPass.newPass);
    setStudentPass(newPass.newPass);

    alert("Password successfully changed!");

    // Reset fields
    setNewPass({ newPass: '', repass: '' });

    setShow(false);
};


    // form submission logic
    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        console.log('Form data submitted: ', formData);
        if (formData.email.toLowerCase() === adminUser && formData.password.toLowerCase() === adminPass) {
            // mark role as admin
            localStorage.setItem('role', 'admin')
            navigate({ pathname: "main" })
        } else if (formData.email.toLowerCase() === studentUser && formData.password.toLowerCase() === studentPass) {
            // mark role as student
            localStorage.setItem('role', 'student')
            navigate({ pathname: "main" })
        } else {
            alert("Invalid login");
        }
    }

    const handlePassword = () => {
        setShow(true);
    }

    const handleClose = () => {
        setNewPass({ newPass: '', repass: '' });
        setShow(false)
  };

  return (
    <>
        <Container className="pageBody">
            <h1>Login</h1>
            <Form className="form" onSubmit={handleSubmit}>
            <Form.Group className="mb-3 formGroup" controlId="formGroupEmail">
                <Form.Label>Email address:</Form.Label>
                <Form.Control className="formInput" type="email" name="email" placeholder="Enter email" value={formData.email} onChange={handleChange}/>
            </Form.Group>
            <Form.Group className="mb-3 formGroup" controlId="formGroupPassword">
                <Form.Label>Password:</Form.Label>
                <Form.Control className="formInput" type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange}/>
            </Form.Group>
            <Button className="button" variant="primary" type="submit">
                Sign In
            </Button>
            </Form>

            <Container className="passBody">
                <h2>Forgot Password?: </h2>
                <Button onClick={() => {handlePassword()}}>Change Password</Button>
            </Container>

            <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Give Feedback</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handlePassSubmit}>
        <Modal.Body>
            <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control as="input" type="email" name="email" placeholder="Enter Email" required/>
            </Form.Group>
          <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
            <Form.Label>New Password</Form.Label>
            <Form.Control as="input" type="password" name="newPass" placeholder="New Password" value={newPass.newPass} onChange={handlePasswordChange} required/>
          </Form.Group>
          <Form.Group className="mb-3" controlId="formGroupPassword">
                <Form.Label>Re-enter Password:</Form.Label>
                <Form.Control as="input" type="password" name="repass" placeholder="Re-enter Password" value={newPass.repass} onChange={handlePasswordChange} required/>
            </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button type='submit' variant="primary">
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
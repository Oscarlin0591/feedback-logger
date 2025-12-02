import { useState, type ChangeEvent, type FormEvent } from "react";
import { Button, Container, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "./Login.css";

interface FormData {
    email: string,
    password: string
}

function Login() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState<FormData>({
        email: '',
        password: '',
    });

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value} = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }))
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        console.log('Form data submitted: ', formData);
        if (formData.email.toLowerCase() === 'admin@qu.edu' && formData.password.toLowerCase() === 'password') {
            navigate({
                pathname: "main"
            })
        } else if (formData.email.toLowerCase() === 'user@qu.edu' && formData.password.toLowerCase() === 'password') {
            navigate({
                pathname: "main"
            })
        } else {
            alert("Invalid login");
        }
    }

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
                Submit
            </Button>
            </Form>
        </Container>
    </>
  );
}

export default Login;
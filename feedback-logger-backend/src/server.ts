import express, { type Request, type Response, type NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const app = express();
const PORT = 3000;
const JWT_SECRET = 'feedback-logger-secret-key';

app.use(helmet());
app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());

// In-memory user store (mirrors frontend users.json with hashed passwords)
const users = [
    {
        id: '1',
        name: 'John User',
        email: 'user@qu.edu',
        password: bcrypt.hashSync('password', 10),
        role: 'student',
        classYear: 2027,
        major: 'Software Engineer',
        department: 'School of Computing and Engineering',
        profileImage: '/default-avatar.jpg',
    },
    {
        id: '2',
        name: 'Alice Admin',
        email: 'admin@qu.edu',
        password: bcrypt.hashSync('password', 10),
        role: 'admin',
        classYear: 2006,
        major: 'Computer Science Ph.D',
        department: 'School of Computing and Engineering',
        profileImage: '/default-avatar.jpg',
    },
];

// Extend Request to carry decoded JWT payload
interface AuthRequest extends Request {
    user?: { id: string; email: string; role: string; name: string };
}

// JWT auth middleware
const authenticate = (req: AuthRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
        res.status(401).json({ message: 'No token provided' });
        return;
    }

    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, JWT_SECRET) as AuthRequest['user'];
        req.user = decoded;
        next();
    } catch {
        res.status(401).json({ message: 'Invalid or expired token' });
    }
};

// POST /api/auth/login
app.post('/api/auth/login', async (req: Request, res: Response) => {
    const { email, password } = req.body as { email: string; password: string };

    const user = users.find((u) => u.email === email.toLowerCase());
    if (!user) {
        res.status(401).json({ message: 'Invalid credentials' });
        return;
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
        res.status(401).json({ message: 'Invalid credentials' });
        return;
    }

    const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role, name: user.name },
        JWT_SECRET,
        { expiresIn: '24h' }
    );

    res.json({ token, role: user.role, name: user.name });
});

// POST /api/auth/change-password  (requires valid JWT)
app.post('/api/auth/change-password', authenticate, async (req: AuthRequest, res: Response) => {
    const { newPassword } = req.body as { newPassword: string };

    const user = users.find((u) => u.id === req.user!.id);
    if (!user) {
        res.status(404).json({ message: 'User not found' });
        return;
    }

    const isSame = await bcrypt.compare(newPassword, user.password);
    if (isSame) {
        res.status(400).json({ message: 'Password cannot be the same as the previous password' });
        return;
    }

    user.password = await bcrypt.hash(newPassword, 10);
    res.json({ message: 'Password changed successfully' });
});

app.listen(PORT, () => {
    console.log(`Backend server running on http://localhost:${PORT}`);
});

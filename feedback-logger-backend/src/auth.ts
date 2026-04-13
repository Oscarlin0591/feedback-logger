import { Router, type Request, type Response, type NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

export const JWT_SECRET = 'feedback-logger-secret-key';

// In-memory user store (mirrors frontend users.json with hashed passwords)
export const users = [
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
export interface AuthRequest extends Request {
    user?: { id: string; email: string; role: string; name: string };
}

// JWT auth middleware
export const authenticate = (req: AuthRequest, res: Response, next: NextFunction) => {
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

const authRouter = Router();

// POST login
authRouter.post('/login', async (req: Request, res: Response) => {
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

// POST for change password  (requires valid JWT)
authRouter.post('/change-password', authenticate, async (req: AuthRequest, res: Response) => {
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

export default authRouter;

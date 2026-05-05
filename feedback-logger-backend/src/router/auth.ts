import { Router, type Request, type Response, type NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import passport from 'passport';
import Student from '../model/Students';
import Professor from '../model/Professor';

export const JWT_SECRET = process.env.JWT_SECRET!;

// Named strategies backed by passport-local-mongoose, keyed on email
passport.use('student', (Student as any).createStrategy());
passport.use('professor', (Professor as any).createStrategy());

export interface AuthRequest extends Request {
    user?: { id: string; email: string; role: string; name: string };
}

// JWT middleware — protects downstream routes
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

// POST /login — { email, password, role: 'student' | 'professor' }
authRouter.post('/login', (req: Request, res: Response, next: NextFunction) => {
    const { role } = req.body as { role?: string };
    const strategy = role === 'professor' ? 'professor' : 'student';

    passport.authenticate(strategy, { session: false }, (err: Error | null, user: any, info: any) => {
        if (err) return next(err);
        if (!user) return res.status(401).json({ message: info?.message ?? 'Invalid credentials' });

        const token = jwt.sign(
            { id: user._id.toString(), email: user.email, role: strategy, name: user.name },
            JWT_SECRET,
            { expiresIn: '24h' }
        );
        res.json({ token, role: strategy, name: user.name });
    })(req, res, next);
});

// POST /change-password — requires valid JWT
authRouter.post('/change-password', authenticate, async (req: AuthRequest, res: Response) => {
    const { newPassword } = req.body as { newPassword: string };
    const { id, role } = req.user!;

    const Model: any = role === 'professor' ? Professor : Student;
    const user = await Model.findById(id);
    if (!user) {
        res.status(404).json({ message: 'User not found' });
        return;
    }

    await user.setPassword(newPassword);
    await user.save();
    res.json({ message: 'Password changed successfully' });
});

export default authRouter;

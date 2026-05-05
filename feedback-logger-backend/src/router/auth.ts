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

// POST /login — { email, password } — role is resolved from the database
authRouter.post('/login', async (req: Request, res: Response, next: NextFunction) => {
    const { email } = req.body as { email?: string };

    // Determine which collection the account lives in
    const studentExists = email ? await Student.exists({ email: email.toLowerCase() }) : null;
    const strategy = studentExists ? 'student' : 'professor';

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

// POST /register — { name, email, password, role: 'student' | 'professor' }
authRouter.post('/register', async (req: Request, res: Response) => {
    const { name, email, password, role } = req.body as { name?: string; email?: string; password?: string; role?: string };

    if (!name || !email || !password) {
        res.status(400).json({ message: 'Name, email, and password are required' });
        return;
    }

    const Model: any = role === 'professor' ? Professor : Student;

    try {
        const user = new Model({ name, email });
        await (Model as any).register(user, password);
        res.status(201).json({ message: 'Account created successfully' });
    } catch (err: any) {
        if (err.name === 'UserExistsError') {
            res.status(409).json({ message: 'An account with that email already exists' });
        } else {
            res.status(500).json({ message: err.message ?? 'Registration failed' });
        }
    }
});

// GET /my-courses — returns courses for the logged-in student or professor
authRouter.get('/my-courses', authenticate, async (req: AuthRequest, res: Response) => {
    const { id, role } = req.user!;
    const Model: any = role === 'professor' ? Professor : Student;
    const user = await Model.findById(id)
        .populate({ path: 'courses', populate: { path: 'instructor', select: 'name' } })
        .lean();
    if (!user) {
        res.status(404).json({ message: 'User not found' });
        return;
    }
    res.json(user.courses ?? []);
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

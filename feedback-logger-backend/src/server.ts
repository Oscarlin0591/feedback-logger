import 'dotenv/config';
import express, { type Request, type Response, type NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import coursesRouter from './routes/courses';
import authRouter from './router/auth';
import debugRouter from './router/debug';
import commentRouter from './router/commentRouter';
import type { JwtPayload } from './types';

const app = express();
const PORT = parseInt(process.env.PORT ?? '3000');
const JWT_SECRET = process.env.JWT_SECRET ?? 'feedback-logger-secret-key';

app.use(helmet());
app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json({ limit: '10mb' }));


app.use('/api/auth', authRouter);
app.use('/api/debug', debugRouter);
app.use('/api/comments', commentRouter);

// JWT auth middleware. req.user is typed via the global Express.Request augmentation in ./types.
export const authenticate = (req: Request, res: Response, next: NextFunction): void => {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
        res.status(401).json({ message: 'No token provided' });
        return;
    }

    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
        req.user = decoded;
        next();
    } catch {
        res.status(401).json({ message: 'Invalid or expired token' });
    }
};

// Protected DB-backed API routes
app.use('/api/courses', authenticate, coursesRouter);

// Connect to MongoDB then start listening
mongoose
    .connect(process.env.MONGODB_URI ?? 'mongodb://127.0.0.1:27017/feedback-logger')
    .then(() => {
        console.log('MongoDB connected');
        app.listen(PORT, () => {
            console.log(`Backend server running on http://localhost:${PORT}`);
        });
    })
    .catch((err: unknown) => {
        console.error('MongoDB connection failed:', err);
        process.exit(1);
    });

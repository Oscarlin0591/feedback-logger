import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import mongoose from 'mongoose';
import passport from 'passport';
import authRouter from './router/auth';
import Student from './model/Students';
import Professor from './model/Professor';

const app = express();
const PORT = 3000;

app.use(helmet());
app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());
app.use(passport.initialize());

app.use('/api/auth', authRouter);

mongoose
    .connect(process.env.MONGODB_URI!)
    .then(async () => {
        console.log('Connected to MongoDB');
        app.listen(PORT, () => {
            console.log(`Backend server running on http://localhost:${PORT}`);
        });
    })
    .catch((err) => {
        console.error('MongoDB connection error:', err);
        process.exit(1);
    });

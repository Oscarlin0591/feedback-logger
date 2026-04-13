import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import authRouter from './auth';

const app = express();
const PORT = 3000;

app.use(helmet());
app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());

app.use('/api/auth', authRouter);

app.listen(PORT, () => {
    console.log(`Backend server running on http://localhost:${PORT}`);
});

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: "*",
    credentials: true
}));
app.use(helmet());
app.use(morgan('dev'));

import authRoutes from './routes/auth.routes';
import formRoutes from './routes/forms.routes';
import reportRoutes from './routes/reports.routes';
import guidelineRoutes from './routes/guidelines.routes';

import userRoutes from './routes/users.routes';
import statsRoutes from './routes/stats.routes';

app.use('/auth', authRoutes);
app.use('/forms', formRoutes);
app.use('/reports', reportRoutes);
app.use('/guidelines', guidelineRoutes);
app.use('/users', userRoutes);
app.use('/stats', statsRoutes);

app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date() });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

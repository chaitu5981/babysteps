import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import http from 'http';
import { Server } from 'socket.io';

import authRoutes from './routes/auth.routes.js';
import milestoneRoutes from './routes/milestone.routes.js';
import analyticsRoutes from './routes/analytics.routes.js';
import tipRoutes from './routes/tip.routes.js';
import weekRoutes from './routes/week.routes.js';

dotenv.config();
const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/milestones', milestoneRoutes(io));
app.use('/api/analytics', analyticsRoutes);
app.use('/api/tips', tipRoutes);
app.use('/api/weeks', weekRoutes);

const PORT = process.env.PORT || 5000;
mongoose.connect(process.env.MONGO_URI)
  .then(() => server.listen(PORT, () => console.log(`Server running on port ${PORT}`)))
  .catch(err => console.error(err));
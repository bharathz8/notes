import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';  // Import cors package
import authRoutes from './routes/authRoutes';
import noteRoutes from './routes/noteRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());

mongoose.connect(process.env.MONGO_URI!)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error(err));

app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/notes', noteRoutes);

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
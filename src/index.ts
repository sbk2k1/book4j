import express from 'express';
import dotenv from 'dotenv';
import graphRoutes from './routes/graph';

dotenv.config();

const app = express();
app.use(express.json());
app.use('/graph', graphRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
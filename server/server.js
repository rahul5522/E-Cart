import app from './app.js';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const port = process.env.PORT;
const DB_URL = process.env.DB_URL;

mongoose
  .connect(DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('DB_Connected Successfully'))
  .catch((err) => console.log('Database connnection failed', err));

app.listen(port, () => {
  console.log(`Server Started on Port ${port}`);
});

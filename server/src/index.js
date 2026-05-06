import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import morgan from 'morgan';
import admin from 'firebase-admin';

dotenv.config();

// Initialize Firebase Admin (Requires process.env.GOOGLE_APPLICATION_CREDENTIALS)
if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
  try {
    admin.initializeApp({
      credential: admin.credential.applicationDefault()
    });
    console.log('Firebase Admin Initialized');
  } catch (err) {
    console.error('Failed to initialize Firebase Admin:', err);
  }
}

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Chat App Backend is running.' });
});

app.post('/api/notify', async (req, res) => {
  const { tokens, title, body } = req.body;

  if (!tokens || tokens.length === 0) {
    return res.status(400).json({ error: 'No tokens provided' });
  }

  try {
    const message = {
      notification: { title, body },
      tokens: tokens,
    };
    const response = await admin.messaging().sendEachForMulticast(message);
    res.status(200).json({ success: true, response });
  } catch (err) {
    console.error('Error sending notification:', err);
    res.status(500).json({ error: 'Failed to send notification' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});

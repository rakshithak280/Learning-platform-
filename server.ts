import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { handleGeminiApi } from './src/server/geminiApiHandler.ts';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// API routes handled by the Gemini API handler
app.all('/api/*', (req, res) => {
  handleGeminiApi(req, res);
});

// Serve production static assets from dist
const distPath = path.resolve(process.cwd(), 'dist');
app.use(express.static(distPath));

app.get('*', (_req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`OmniEngineer server listening on http://localhost:${PORT}`);
});

import express from 'express';
import { createServer as createViteServer } from 'vite';
import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Route for Prediction
  app.post('/predict', async (req, res) => {
    const { birth_year, birth_month, birth_day } = req.body;

    const targetDate = { year: 2026, month: 3, day: 31 };
    
    let years = targetDate.year - birth_year;
    let months = targetDate.month - birth_month;
    let days = targetDate.day - birth_day;

    if (days < 0) {
      months -= 1;
      // Days in previous month (February 2026 has 28 days)
      const prevMonthDays = birth_month === 3 ? 28 : (new Date(2026, targetDate.month - 1, 0).getDate());
      days += prevMonthDays;
    }

    if (months < 0) {
      years -= 1;
      months += 12;
    }

    res.json({
      prediction: `${Math.max(0, years)} years`,
      details: {
        years: Math.max(0, years),
        months: Math.max(0, months),
        days: Math.max(0, days)
      },
      confidence: 0.99
    });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    if (fs.existsSync(distPath)) {
        app.use(express.static(distPath));
        app.get('*', (req, res) => {
          res.sendFile(path.join(distPath, 'index.html'));
        });
    }
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();

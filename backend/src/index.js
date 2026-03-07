import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import connectDB from './config/database.js';
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import productRoutes from './routes/products.js';
import patientRoutes from './routes/patients.js';
import appointmentRoutes from './routes/appointments.js';
import messageRoutes from './routes/messages.js';
import reportRoutes from './routes/reports.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Get absolute path to uploads
// Current file: primee-backend/src/index.js
// Go up 1 level: primee-backend/
// Then add uploads
const uploadsPath = path.resolve(__dirname, '../uploads');

console.log('\n╔════════════════════════════════════════╗');
console.log('║       SERVER CONFIGURATION             ║');
console.log('╚════════════════════════════════════════╝');
console.log('__dirname:', __dirname);
console.log('uploadsPath:', uploadsPath);
console.log('uploads exists:', fs.existsSync(uploadsPath));
console.log('reports exists:', fs.existsSync(path.join(uploadsPath, 'reports')));

// List files in reports directory
if (fs.existsSync(path.join(uploadsPath, 'reports'))) {
  const files = fs.readdirSync(path.join(uploadsPath, 'reports'));
  console.log(`files in reports: ${files.length} total`);
  if (files.length > 0) {
    console.log('Sample files:', files.slice(0, 3));
  }
}
console.log('╚════════════════════════════════════════╝\n');

// Serve static files from uploads directory
app.use('/uploads', express.static(uploadsPath, {
  dotfiles: 'allow',
  etag: false,
  setHeaders: (res, path) => {
    res.setHeader('Cache-Control', 'no-cache');
    console.log('📤 Serving:', path);
  }
}));

// Test endpoint to verify file serving
app.get('/api/uploads-status', (req, res) => {
  const reportsPath = path.join(uploadsPath, 'reports');
  
  try {
    const reportsExist = fs.existsSync(reportsPath);
    let files = [];
    
    if (reportsExist) {
      files = fs.readdirSync(reportsPath).map(file => {
        const filePath = path.join(reportsPath, file);
        const stats = fs.statSync(filePath);
        return {
          name: file,
          size: stats.size,
          created: stats.birthtime
        };
      });
    }
    
    return res.json({
      uploadsPath,
      uploadsExist: fs.existsSync(uploadsPath),
      reportsPath,
      reportsExist,
      totalFiles: files.length,
      files: files.slice(0, 10),
      sampleUrl: files.length > 0 ? `/uploads/reports/${files[0].name}` : null
    });
  } catch (error) {
    return res.status(500).json({
      error: error.message,
      uploadsPath,
      reportsPath
    });
  }
});

// Test file endpoint
app.get('/uploads/test.html', (req, res) => {
  res.send(`
    <html>
      <body>
        <h1>Upload Test</h1>
        <p>If you see this, the /uploads route is working!</p>
        <p>Try accessing: <a href="/api/uploads-status">/api/uploads-status</a></p>
      </body>
    </html>
  `);
});

// Connect to MongoDB
connectDB();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/reports', reportRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running' });
});

// 404 handler
app.use((req, res) => {
  console.log('⚠️  404 Not Found:', req.method, req.path);
  res.status(404).json({ success: false, message: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('❌ Error:', err.message);
  res.status(500).json({
    success: false,
    message: 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`\n✅ Server running on http://localhost:${PORT}`);
  console.log(`📁 Static files: http://localhost:${PORT}/uploads`);
  console.log(`📊 Status check: http://localhost:${PORT}/api/uploads-status`);
  console.log(`🧪 Test: http://localhost:${PORT}/uploads/test.html\n`);
});
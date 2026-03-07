import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadsDir = path.resolve(__dirname, '../../uploads');
const reportsDir = path.resolve(__dirname, '../../uploads/reports');

console.log('\n🔍 DEBUG PATH RESOLUTION:');
console.log('reportsDir:', reportsDir);

// Ensure directories exist
const ensureDirectories = () => {
  try {
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
      console.log('✅ Created:', uploadsDir);
    }
    
    if (!fs.existsSync(reportsDir)) {
      fs.mkdirSync(reportsDir, { recursive: true });
      console.log('✅ Created:', reportsDir);
    }
    
    fs.accessSync(reportsDir, fs.constants.W_OK);
    console.log('✅ Directory is writable');
    
    return true;
  } catch (error) {
    console.error('❌ Directory error:', error.message);
    return false;
  }
};

ensureDirectories();

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    try {
      if (!fs.existsSync(reportsDir)) {
        fs.mkdirSync(reportsDir, { recursive: true });
      }
      console.log('📂 Saving file to:', reportsDir);
      cb(null, reportsDir);
    } catch (error) {
      console.error('❌ Destination error:', error);
      cb(error);
    }
  },
  filename: (req, file, cb) => {
    try {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const ext = path.extname(file.originalname);
      const fileName = uniqueSuffix + ext;
      console.log('📝 Generated filename:', fileName);
      cb(null, fileName);
    } catch (error) {
      console.error('❌ Filename error:', error);
      cb(error);
    }
  }
});

// File filter
const fileFilter = (req, file, cb) => {
  const allowedMimes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
  const ext = path.extname(file.originalname).toLowerCase();
  
  console.log('🔍 Checking file:', file.originalname, 'MIME:', file.mimetype);
  
  if (allowedMimes.includes(file.mimetype)) {
    console.log('✅ File accepted');
    cb(null, true);
  } else {
    console.log('❌ File rejected - invalid type');
    cb(new Error('Only image files are allowed'));
  }
};

// Create multer instance - SUPPORT MULTIPLE FILES
export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB per file
});

console.log('✅ Multer configured for multiple files\n');
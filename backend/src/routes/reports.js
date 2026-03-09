import express from 'express';
import Report from '../models/Report.js';
import Patient from '../models/Patient.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { cloudinaryUpload, cloudinary } from '../config/cloudinary.js';

const router = express.Router();

// Get all reports (admin only)
router.get('/', authenticate, authorize(['admin']), async (req, res) => {
  try {
    const reports = await Report.find()
      .populate('patientId', 'patientId fullName email')
      .populate('uploadedBy', 'name')
      .sort({ createdAt: -1 });

    res.json({ success: true, reports: reports || [] });
  } catch (error) {
    console.error('Error fetching reports:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get reports by patient ID (Public lookup via Patient ID)
router.get('/patient/:patientId', async (req, res) => {
  try {
    const patientIdParam = req.params.patientId;
    let mongoDbId = patientIdParam;

    console.log('Searching for patient:', patientIdParam);

    // If the param looks like PT00001 (patientId format), find the MongoDB _id first
    if (patientIdParam.match(/^PT\d+$/i)) {
      console.log('Converting PT format to MongoDB ID');
      const patient = await Patient.findOne({ patientId: patientIdParam.toUpperCase() });

      if (!patient) {
        return res.status(404).json({
          success: false,
          message: `Patient with ID ${patientIdParam} not found`
        });
      }

      mongoDbId = patient._id.toString();
      console.log('Found MongoDB ID:', mongoDbId);
    }

    // Now search reports using the MongoDB ID
    const reports = await Report.find({ patientId: mongoDbId })
      .populate('patientId', 'patientId fullName')
      .populate('uploadedBy', 'name')
      .sort({ createdAt: -1 });

    if (!reports || reports.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No reports found for this patient'
      });
    }

    console.log(`Found ${reports.length} report(s) for patient ${patientIdParam}`);
    res.json({ success: true, reports });
  } catch (error) {
    console.error('Error fetching reports:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get single report
router.get('/:id', authenticate, async (req, res) => {
  try {
    const report = await Report.findById(req.params.id)
      .populate('patientId', 'patientId fullName email')
      .populate('uploadedBy', 'name');

    if (!report) {
      return res.status(404).json({ success: false, message: 'Report not found' });
    }

    res.json({ success: true, report });
  } catch (error) {
    console.error('Error fetching report:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Upload report with MULTIPLE images (admin only)
router.post('/upload', authenticate, authorize(['admin']), cloudinaryUpload.array('reportImages', 10), async (req, res) => {
  let uploadedFiles = [];

  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: 'No image files provided' });
    }

    uploadedFiles = req.files;
    console.log('Files uploaded:', uploadedFiles.length);

    const {
      patientId,
      patientName,
      patientEmail,
      patientPhone,
      patientDateOfBirth,
      patientGender,
      createNewPatient,
      reportType,
      department,
      reportDate,
      description,
      doctorName
    } = req.body;

    if (!reportType || !department || !reportDate || !doctorName) {
      return res.status(400).json({
        success: false,
        message: 'Missing report fields. Required: reportType, department, reportDate, doctorName'
      });
    }

    let finalPatientId = null;
    let finalPatientName = null;

    // CASE 1: Using existing patient
    if (patientId && patientId.trim() !== '' && createNewPatient !== 'true') {
      try {
        const existingPatient = await Patient.findById(patientId);
        if (!existingPatient) {
          return res.status(404).json({ success: false, message: 'Patient not found' });
        }
        finalPatientId = existingPatient._id;
        finalPatientName = existingPatient.fullName;
      } catch (err) {
        console.error('Error finding patient:', err);
        return res.status(500).json({ success: false, message: 'Error finding patient' });
      }
    }

    // CASE 2: Creating new patient
    else if (createNewPatient === 'true') {
      if (!patientName || !patientEmail || !patientPhone || !patientDateOfBirth || !patientGender) {
        return res.status(400).json({
          success: false,
          message: 'Missing patient details'
        });
      }

      try {
        const existingByEmail = await Patient.findOne({
          email: patientEmail.toLowerCase().trim()
        });
        if (existingByEmail) {
          return res.status(400).json({
            success: false,
            message: 'Email already registered'
          });
        }

        const newPatient = new Patient({
          fullName: patientName.trim(),
          email: patientEmail.toLowerCase().trim(),
          phone: patientPhone.trim(),
          dateOfBirth: new Date(patientDateOfBirth),
          gender: patientGender.trim(),
          userId: req.userId,
          createdBy: req.userId
        });

        await newPatient.save();
        console.log('Patient created:', newPatient.patientId);

        finalPatientId = newPatient._id;
        finalPatientName = newPatient.fullName;
      } catch (err) {
        console.error('Error creating patient:', err);
        return res.status(500).json({
          success: false,
          message: 'Error creating patient: ' + err.message
        });
      }
    }

    if (!finalPatientId) {
      return res.status(400).json({
        success: false,
        message: 'Please select an existing patient or create a new one'
      });
    }

    // Create reports for each uploaded image
    try {
      const savedReports = [];

      for (const file of uploadedFiles) {
        // Cloudinary provides the secure_url in the file object
        const reportImageUrl = file.path;

        const newReport = new Report({
          patientId: finalPatientId,
          patientName: finalPatientName,
          reportType: reportType.trim(),
          department: department.trim(),
          reportDate: new Date(reportDate),
          reportImageUrl: reportImageUrl,
          description: description?.trim() || null,
          doctorName: doctorName.trim(),
          uploadedBy: req.userId
        });

        await newReport.save();
        await newReport.populate('patientId', 'patientId fullName');
        await newReport.populate('uploadedBy', 'name');

        savedReports.push(newReport);
      }

      console.log('All reports saved successfully');

      return res.status(201).json({
        success: true,
        message: `${savedReports.length} report(s) uploaded successfully`,
        reports: savedReports,
        patientId: finalPatientId,
        patientName: finalPatientName
      });
    } catch (err) {
      console.error('Error saving reports:', err);
      return res.status(500).json({
        success: false,
        message: 'Error saving reports: ' + err.message
      });
    }

  } catch (error) {
    console.error('Upload error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error: ' + error.message
    });
  }
});

// Update report
router.put('/:id', authenticate, authorize(['admin']), async (req, res) => {
  try {
    const { description, doctorName } = req.body;

    const report = await Report.findByIdAndUpdate(
      req.params.id,
      { description, doctorName },
      { new: true, runValidators: true }
    ).populate('patientId', 'patientId fullName').populate('uploadedBy', 'name');

    if (!report) {
      return res.status(404).json({ success: false, message: 'Report not found' });
    }

    res.json({ success: true, message: 'Report updated successfully', report });
  } catch (error) {
    console.error('Error updating report:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Delete report
router.delete('/:id', authenticate, authorize(['admin']), async (req, res) => {
  try {
    const report = await Report.findByIdAndDelete(req.params.id);

    if (!report) {
      return res.status(404).json({ success: false, message: 'Report not found' });
    }

    // Optional: Delete from Cloudinary if URL is a Cloudinary URL
    if (report.reportImageUrl && report.reportImageUrl.includes('cloudinary')) {
      const publicId = report.reportImageUrl.split('/').pop().split('.')[0];
      const folder = 'prime-hospital/reports/';
      await cloudinary.uploader.destroy(folder + publicId);
    }

    res.json({ success: true, message: 'Report deleted successfully' });
  } catch (error) {
    console.error('Error deleting report:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
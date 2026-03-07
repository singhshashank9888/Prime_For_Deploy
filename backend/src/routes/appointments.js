import express from 'express';
import Appointment from '../models/Appointment.js';
import Patient from '../models/Patient.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { sendEmail } from '../config/email.js';

const router = express.Router();

// Get all appointments (admin only)
router.get('/', authenticate, authorize(['admin']), async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .populate('patientId')
      .populate('confirmedBy', 'name');
    
    res.json({ success: true, appointments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get appointments for current user
router.get('/user/me', authenticate, async (req, res) => {
  try {
    const appointments = await Appointment.find({ patientId: req.userId })
      .populate('patientId');
    
    res.json({ success: true, appointments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get appointment by ID
router.get('/:id', authenticate, async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate('patientId')
      .populate('confirmedBy', 'name');
    
    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }

    res.json({ success: true, appointment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Create appointment
router.post('/', async (req, res) => {
  try {
    const { patientName, email, phone, department, appointmentDate, timeSlot, reason } = req.body;

    if (!patientName || !email || !phone || !department || !appointmentDate || !timeSlot) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please provide all required fields' 
      });
    }

    const appointment = new Appointment({
      patientId: null,
      patientName,
      email,
      phone,
      department,
      appointmentDate,
      timeSlot,
      reason,
      status: 'pending'
    });

    await appointment.save();

    // Send confirmation email
    const emailContent = `
      <h2>Appointment Confirmation</h2>
      <p>Dear ${patientName},</p>
      <p>Your appointment request has been received. We will contact you shortly to confirm.</p>
      <h3>Appointment Details:</h3>
      <ul>
        <li><strong>Department:</strong> ${department}</li>
        <li><strong>Date:</strong> ${new Date(appointmentDate).toLocaleDateString()}</li>
        <li><strong>Time:</strong> ${timeSlot}</li>
        <li><strong>Reason:</strong> ${reason || 'General Checkup'}</li>
      </ul>
      <p>Thank you for choosing Prime Hospital!</p>
    `;

    await sendEmail(email, 'Appointment Request Received', emailContent);

    res.status(201).json({
      success: true,
      message: 'Appointment request submitted successfully',
      appointment
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ✅ FIXED: Confirm appointment - PROPERLY CREATE PATIENT WITH ALL REQUIRED FIELDS
router.put('/:id/confirm', authenticate, authorize(['admin']), async (req, res) => {
  try {
    const { notes } = req.body;
    
    // First, fetch the appointment to get all details
    const appointment = await Appointment.findById(req.params.id);
    
    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }

    let patientId = appointment.patientId;

    // ✅ Create patient if one doesn't exist
    if (!patientId) {
      try {
        // Check if patient with this email already exists
        let patient = await Patient.findOne({ email: appointment.email });
        
        if (!patient) {
          // ✅ FIXED: Include ALL REQUIRED fields for patient creation
          patient = new Patient({
            fullName: appointment.patientName,
            email: appointment.email,
            phone: appointment.phone,
            dateOfBirth: new Date(), // ✅ FIX: Set to current date (required field)
            gender: 'Other', // ✅ FIX: Default gender (required field)
            address: '',
            medicalHistory: `Confirmed appointment for ${appointment.department} on ${new Date(appointment.appointmentDate).toLocaleDateString()}. Reason: ${appointment.reason || 'General Checkup'}`,
            bloodGroup: null,
            userId: req.userId, // ✅ FIX: Use admin's ID (required field)
            createdBy: req.userId, // ✅ FIX: Admin who created the patient
          });
          
          await patient.save();
          console.log('✅ New patient created with ID:', patient.patientId);
        }
        
        patientId = patient._id;
      } catch (patientError) {
        console.error('❌ Error creating patient:', patientError);
        return res.status(400).json({ 
          success: false, 
          message: `Failed to create patient: ${patientError.message}` 
        });
      }
    }

    // Update appointment with patient ID
    const updatedAppointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      {
        status: 'confirmed',
        patientId: patientId,
        notes,
        confirmedBy: req.userId,
        confirmedAt: new Date()
      },
      { new: true }
    ).populate('patientId');

    // Send confirmation email to patient
    const patientIDStr = updatedAppointment.patientId?.patientId || 'N/A';
    const emailContent = `
      <h2>Appointment Confirmed!</h2>
      <p>Dear ${appointment.patientName},</p>
      <p>Your appointment has been confirmed by Prime Hospital.</p>
      <h3>Confirmed Appointment Details:</h3>
      <ul>
        <li><strong>Department:</strong> ${appointment.department}</li>
        <li><strong>Date:</strong> ${new Date(appointment.appointmentDate).toLocaleDateString()}</li>
        <li><strong>Time:</strong> ${appointment.timeSlot}</li>
        <li><strong>Your Patient ID:</strong> <strong>${patientIDStr}</strong></li>
        ${notes ? `<li><strong>Notes:</strong> ${notes}</li>` : ''}
      </ul>
      <p>Please arrive 15 minutes before your appointment time.</p>
      <p>Thank you for choosing Prime Hospital!</p>
    `;

    await sendEmail(appointment.email, 'Appointment Confirmed', emailContent);

    res.json({ 
      success: true, 
      message: `Appointment confirmed! Patient ID: ${patientIDStr}`, 
      appointment: updatedAppointment 
    });
  } catch (error) {
    console.error('❌ Error confirming appointment:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Cancel appointment
router.put('/:id/cancel', authenticate, async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    
    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }

    await Appointment.findByIdAndUpdate(
      req.params.id,
      { status: 'cancelled' },
      { new: true }
    );

    res.json({ success: true, message: 'Appointment cancelled' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Patient',
      default: null  // ← Make it optional
    },
    patientName: {
      type: String,
      required: [true, 'Patient name is required']
    },
    email: {
      type: String,
      required: [true, 'Email is required']
    },
    phone: {
      type: String,
      required: [true, 'Phone is required']
    },
    department: {
      type: String,
      required: [true, 'Department is required']
    },
    doctor: {
      type: String,
      default: null
    },
    appointmentDate: {
      type: Date,
      required: [true, 'Appointment date is required']
    },
    timeSlot: {
      type: String,
      required: [true, 'Time slot is required']
    },
    reason: {
      type: String,
      trim: true,
      default: null
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'completed', 'cancelled'],
      default: 'pending'
    },
    notes: {
      type: String,
      trim: true,
      default: null
    },
    confirmedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    confirmedAt: {
      type: Date,
      default: null
    }
  },
  { timestamps: true }
);

const Appointment = mongoose.model('Appointment', appointmentSchema);
export default Appointment;
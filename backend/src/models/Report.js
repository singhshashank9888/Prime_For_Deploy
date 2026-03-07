import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Patient',
      required: [true, 'Patient ID is required']
    },
    patientName: {
      type: String,
      required: true
    },
    reportType: {
      type: String,
      enum: ['X-Ray', 'CT Scan', 'Ultrasound', 'Blood Test', 'MRI', 'ECG', 'Other'],
      required: [true, 'Report type is required']
    },
    department: {
      type: String,
      required: [true, 'Department is required']
    },
    reportDate: {
      type: Date,
      required: [true, 'Report date is required']
    },
    reportImageUrl: {
      type: String,
      required: [true, 'Report image is required']
    },
    description: {
      type: String,
      trim: true,
      default: null
    },
    doctorName: {
      type: String,
      required: true
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

const Report = mongoose.model('Report', reportSchema);
export default Report;
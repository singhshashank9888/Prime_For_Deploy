import mongoose from 'mongoose';

const patientSchema = new mongoose.Schema(
  {
    patientId: {
      type: String,
      unique: true,
      sparse: true,
      uppercase: true
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    fullName: {
      type: String,
      required: [true, 'Please provide full name'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Please provide email'],
      lowercase: true,
      trim: true
    },
    phone: {
      type: String,
      required: [true, 'Please provide phone number'],
      trim: true
    },
    dateOfBirth: {
      type: Date,
      required: [true, 'Please provide date of birth']
    },
    gender: {
      type: String,
      enum: ['Male', 'Female', 'Other'],
      required: true
    },
    address: {
      type: String,
      trim: true,
      default: null
    },
    medicalHistory: {
      type: String,
      trim: true,
      default: null
    },
    bloodGroup: {
      type: String,
      enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', null],
      default: null
    },
    isActive: {
      type: Boolean,
      default: true
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  { timestamps: true }
);

// Auto-generate patient ID on save
patientSchema.pre('save', async function (next) {
  try {
    // Only generate if patientId doesn't exist
    if (!this.patientId) {
      const count = await this.constructor.countDocuments();
      this.patientId = `PT${String(count + 1).padStart(5, '0')}`;
      console.log('Generated patientId:', this.patientId);
    }
    next();
  } catch (error) {
    console.error('Error generating patientId:', error);
    next(error);
  }
});

// Create indexes for performance
patientSchema.index({ patientId: 1 });
patientSchema.index({ email: 1 });
patientSchema.index({ fullName: 1 });

const Patient = mongoose.model('Patient', patientSchema);
export default Patient;
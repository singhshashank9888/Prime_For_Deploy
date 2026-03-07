import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide name'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Please provide email'],
      lowercase: true
    },
    phone: {
      type: String,
      trim: true
    },
    subject: {
      type: String,
      required: [true, 'Please provide subject'],
      trim: true
    },
    message: {
      type: String,
      required: [true, 'Please provide message']
    },
    status: {
      type: String,
      enum: ['new', 'read', 'replied'],
      default: 'new'
    },
    repliedMessage: {
      type: String,
      default: null
    },
    repliedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    repliedAt: {
      type: Date,
      default: null
    }
  },
  { timestamps: true }
);

const Message = mongoose.model('Message', messageSchema);
export default Message;
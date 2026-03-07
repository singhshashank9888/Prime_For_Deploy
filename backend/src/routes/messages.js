import express from 'express';
import Message from '../models/Message.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { sendEmail } from '../config/email.js';

const router = express.Router();

// Get all messages (admin only)
router.get('/', authenticate, authorize(['admin']), async (req, res) => {
  try {
    const messages = await Message.find().populate('repliedBy', 'name');
    res.json({ success: true, messages });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get message by ID
router.get('/:id', authenticate, authorize(['admin']), async (req, res) => {
  try {
    const message = await Message.findByIdAndUpdate(
      req.params.id,
      { status: 'read' },
      { new: true }
    ).populate('repliedBy', 'name');
    
    if (!message) {
      return res.status(404).json({ success: false, message: 'Message not found' });
    }

    res.json({ success: true, message });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Create message (from contact form)
router.post('/', async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please provide all required fields' 
      });
    }

    const newMessage = new Message({
      name,
      email,
      phone,
      subject,
      message,
      status: 'new'
    });

    await newMessage.save();

    // Send confirmation email to sender
    const senderEmail = `
      <h2>We Received Your Message</h2>
      <p>Dear ${name},</p>
      <p>Thank you for contacting Prime Hospital. We have received your message and will get back to you shortly.</p>
      <p><strong>Subject:</strong> ${subject}</p>
      <p>Our team will respond within 24 hours.</p>
      <p>Best regards,<br>Prime Hospital Team</p>
    `;

    await sendEmail(email, 'Message Received', senderEmail);

    // Send admin notification
    const adminEmail = `
      <h2>New Contact Form Submission</h2>
      <p><strong>From:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
      <p><strong>Subject:</strong> ${subject}</p>
      <p><strong>Message:</strong></p>
      <p>${message}</p>
    `;

    await sendEmail(process.env.EMAIL_USER, `New Message: ${subject}`, adminEmail);

    res.status(201).json({
      success: true,
      message: 'Message sent successfully'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Reply to message (admin only)
router.put('/:id/reply', authenticate, authorize(['admin']), async (req, res) => {
  try {
    const { repliedMessage } = req.body;

    const message = await Message.findByIdAndUpdate(
      req.params.id,
      {
        status: 'replied',
        repliedMessage,
        repliedBy: req.userId,
        repliedAt: new Date()
      },
      { new: true }
    ).populate('repliedBy', 'name');

    // Send reply email to sender
    const replyEmail = `
      <h2>Reply to Your Message</h2>
      <p>Dear ${message.name},</p>
      <p>Thank you for contacting Prime Hospital. Here is our response to your message:</p>
      <p>${repliedMessage}</p>
      <p>If you have any further questions, please don't hesitate to contact us.</p>
      <p>Best regards,<br>Prime Hospital Team</p>
    `;

    await sendEmail(message.email, `Re: ${message.subject}`, replyEmail);

    res.json({ success: true, message: 'Reply sent successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
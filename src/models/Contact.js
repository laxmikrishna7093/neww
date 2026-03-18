import mongoose from 'mongoose';

const ContactSchema = new mongoose.Schema({
  name:       { type: String, required: true },
  email:      { type: String, required: true },
  phone:      { type: String, required: true },
  jobType:    { type: String, required: true },
  experience: { type: String },
  location:   { type: String },
  message:    { type: String },
  resumeName: { type: String },
  status:     { type: String, enum: ['new', 'contacted', 'hired', 'rejected'], default: 'new' },
}, { timestamps: true });

export default mongoose.models.Contact || mongoose.model('Contact', ContactSchema);
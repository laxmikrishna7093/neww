// src/models/Service.js
import mongoose from 'mongoose';

const ServiceSchema = new mongoose.Schema({
  title:       { type: String, required: true },
  tagline:     { type: String, default: '' },
  tag:         { type: String, required: true },
  accent:      { type: String, default: '#1B4332' },
  accentLight: { type: String, default: '#6EE7B7' },
  photo:       { type: String, default: '' },
  stat:        { type: String, default: '' },
  statLabel:   { type: String, default: '' },
  desc:        { type: String, default: '' },
  features:    [{ type: String }],
}, { timestamps: true });

export default mongoose.models.Service || mongoose.model('Service', ServiceSchema);
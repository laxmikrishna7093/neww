// src/models/Employee.js
import mongoose from 'mongoose';

const EmployeeSchema = new mongoose.Schema({
  empCode:          { type: String, required: true, unique: true, trim: true },
  firstName:        { type: String, required: true, trim: true },
  lastName:         { type: String, default: '', trim: true },
  name:             { type: String, default: '' },
  email:            { type: String, default: '' },
  phone:            { type: String, default: '' },
  department:       { type: String, default: '' },
  position:         { type: String, default: '' },
  salary:           { type: Number, default: 0 },
  reportingManager: { type: String, default: '' },
  gender:           { type: String, default: '' },
  bloodGroup:       { type: String, default: '' },
  employmentType:   { type: String, default: 'Full Time' },
  doj:              { type: String, default: '' },
  status:           { type: String, default: 'Existing' },
  letterStatus:     { type: String, default: 'Pending' },
  photoUrl:         { type: String, default: '' },
  panCard:          { type: String, default: '' },
  aadhaar:          { type: String, default: '' },
}, { timestamps: true });

export default mongoose.models.Employee || mongoose.model('Employee', EmployeeSchema);
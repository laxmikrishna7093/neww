import mongoose from 'mongoose';

const EmployeeSchema = new mongoose.Schema({
  empCode:          { type: String, required: true, unique: true, trim: true },
  name:             { type: String, trim: true },       // full name (auto-generated)
  firstName:        { type: String, trim: true },       // ✅ NEW
  lastName:         { type: String, trim: true },       // ✅ NEW
  email:            { type: String, trim: true },
  phone:            { type: String, trim: true },
  department:       { type: String, trim: true },
  position:         { type: String, trim: true },
  salary:           { type: Number, default: 0 },
  reportingManager: { type: String, trim: true },
  gender:           { type: String, trim: true },
  bloodGroup:       { type: String, trim: true },       // ✅ NEW
  employmentType:   { type: String, default: 'Full Time' },
  doj:              { type: Date },
  status:           { type: String, default: 'Existing' },
  letterStatus:     { type: String, default: 'Pending' },
  panCard:          { type: String },
  aadhaar:          { type: String },
}, { timestamps: true });

export default mongoose.models.Employee || mongoose.model('Employee', EmployeeSchema);
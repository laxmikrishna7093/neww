import mongoose from 'mongoose';

const EmployeeSchema = new mongoose.Schema({
  name:       { type: String, required: true },
  email:      { type: String, required: true },
  phone:      { type: String },
  department: { type: String },
  position:   { type: String },
  salary:     { type: Number },
  panCard:    { type: String },   // file path
  aadhaar:    { type: String },   // file path
  joiningDate:{ type: Date },
}, { timestamps: true });

export default mongoose.models.Employee || mongoose.model('Employee', EmployeeSchema);
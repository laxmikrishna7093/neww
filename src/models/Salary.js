import mongoose from 'mongoose';

const SalarySchema = new mongoose.Schema({
  employeeId:  { type: mongoose.Schema.Types.ObjectId, ref: 'Employee' },
  month:       { type: String, required: true },
  year:        { type: Number, required: true },
  basicSalary: { type: Number },
  allowances:  { type: Number, default: 0 },
  deductions:  { type: Number, default: 0 },
  netSalary:   { type: Number },
  pdfPath:     { type: String },
  paidOn:      { type: Date },
}, { timestamps: true });

export default mongoose.models.Salary || mongoose.model('Salary', SalarySchema);
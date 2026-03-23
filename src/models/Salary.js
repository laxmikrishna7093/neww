// src/models/Salary.js
import mongoose from 'mongoose';

const SalarySchema = new mongoose.Schema({
  employeeId:  { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true },
  empCode:     { type: String, required: true },
  month:       { type: String, required: true },
  year:        { type: String, required: true },
  uan:         { type: String, default: '' },
  basicSalary: { type: Number, default: 0 },
  totalDays:   { type: Number, default: 30 },
  workedDays:  { type: Number, default: 30 },
  pf:          { type: Number, default: 0 },
  esi:         { type: Number, default: 0 },
  totalDed:    { type: Number, default: 0 },
  netSalary:   { type: Number, default: 0 },
  generatedAt: { type: Date, default: Date.now },
}, { timestamps: true });

// One payslip per employee per month/year
SalarySchema.index({ employeeId: 1, month: 1, year: 1 }, { unique: true });

export default mongoose.models.Salary || mongoose.model('Salary', SalarySchema);
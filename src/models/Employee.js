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

  // ── PERSONAL / FAMILY ──
  spouseOrGuardian: { type: String, default: '' },
  aadhaarNumber:    { type: String, default: '' },   // text (separate from upload)
  emergencyContact: { type: String, default: '' },   // name
  emergencyPhone:   { type: String, default: '' },   // phone number
  nomineeName:      { type: String, default: '' },   // insurance nominee
  nomineeRelation:  { type: String, default: '' },   // relation to nominee
  uanNumber:        { type: String, default: '' },   // PF UAN

  // ── BANK ──
  bankName:         { type: String, default: '' },
  accountNumber:    { type: String, default: '' },
  ifscCode:         { type: String, default: '' },   // salary transfer ki must

  // ── ADDRESS ──
  addressLine1:     { type: String, default: '' },
  addressLine2:     { type: String, default: '' },
  city:             { type: String, default: '' },
  state:            { type: String, default: '' },
  pincode:          { type: String, default: '' },

}, { timestamps: true });

export default mongoose.models.Employee || mongoose.model('Employee', EmployeeSchema);
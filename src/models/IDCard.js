import mongoose from "mongoose";

const IDCardSchema = new mongoose.Schema(
  {
    employeeId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    designation: {
      type: String,
      default: "",
      trim: true,
    },
    mobile: {
      type: String,
      default: "",
      trim: true,
    },
    photo: {
      type: String,
      default: "", // stores base64 data URL
    },
    generatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true, // adds createdAt and updatedAt
  }
);

const IDCard = mongoose.models.IDCard || mongoose.model("IDCard", IDCardSchema);

export default IDCard;
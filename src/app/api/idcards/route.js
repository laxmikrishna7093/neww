import  { connectDB } from "@/lib/mongodb";
import IDCard from "@/models/IDCard";

// ─── GET /api/idcards ─────────────────────────────────────────────────────
// Returns all saved ID cards sorted by newest first
export async function GET() {
  try {
    await connectDB();

    const cards = await IDCard.find({}).sort({ createdAt: -1 }).lean();

    return Response.json({
      success: true,
      count: cards.length,
      data: cards,
    });
  } catch (error) {
    console.error("GET /api/idcards error:", error);
    return Response.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// ─── POST /api/idcards ────────────────────────────────────────────────────
// Creates a new ID card and saves to MongoDB
// Body: { name, designation, mobile, photo }
export async function POST(request) {
  try {
    await connectDB();

    const body = await request.json();
    const { name, designation, mobile, photo } = body;

    // Validate required field
    if (!name || !name.trim()) {
      return Response.json(
        { success: false, error: "Employee name is required" },
        { status: 400 }
      );
    }

    // Auto-generate unique Employee ID from name
    // e.g. "Rahul Sharma" → "RAHUL" + random 3 digits = "RAHUL347"
    const prefix = name
      .replace(/\s+/g, "")
      .substring(0, 5)
      .toUpperCase();
    const suffix = String(Math.floor(Math.random() * 900) + 100);
    const employeeId = prefix + suffix;

    // Create and save the card
    const card = await IDCard.create({
      employeeId,
      name: name.trim(),
      designation: designation?.trim() || "",
      mobile: mobile?.trim() || "",
      photo: photo || "",
    });

    return Response.json(
      {
        success: true,
        message: "ID Card created successfully",
        data: card,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/idcards error:", error);

    // Handle duplicate employeeId (very rare, but possible)
    if (error.code === 11000) {
      return Response.json(
        { success: false, error: "Duplicate Employee ID. Please try again." },
        { status: 409 }
      );
    }

    return Response.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
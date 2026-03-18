import { connectDB } from "@/lib/mongodb";
import IDCard from "@/models/IDCard";

// ─── GET /api/idcards/[id] ────────────────────────────────────────────────
// Fetch a single ID card by MongoDB _id
export async function GET(request, { params }) {
  try {
    await connectDB();

    const { id } = params;
    const card = await IDCard.findById(id).lean();

    if (!card) {
      return Response.json(
        { success: false, error: "ID Card not found" },
        { status: 404 }
      );
    }

    return Response.json({ success: true, data: card });
  } catch (error) {
    console.error("GET /api/idcards/[id] error:", error);
    return Response.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// ─── PUT /api/idcards/[id] ────────────────────────────────────────────────
// Update an existing ID card
// Body: { name, designation, mobile, photo }
export async function PUT(request, { params }) {
  try {
    await connectDB();

    const { id } = params;
    const body = await request.json();
    const { name, designation, mobile, photo } = body;

    if (!name || !name.trim()) {
      return Response.json(
        { success: false, error: "Employee name is required" },
        { status: 400 }
      );
    }

    const updatedCard = await IDCard.findByIdAndUpdate(
      id,
      {
        name: name.trim(),
        designation: designation?.trim() || "",
        mobile: mobile?.trim() || "",
        photo: photo || "",
      },
      { new: true, runValidators: true }
    );

    if (!updatedCard) {
      return Response.json(
        { success: false, error: "ID Card not found" },
        { status: 404 }
      );
    }

    return Response.json({
      success: true,
      message: "ID Card updated successfully",
      data: updatedCard,
    });
  } catch (error) {
    console.error("PUT /api/idcards/[id] error:", error);
    return Response.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// ─── DELETE /api/idcards/[id] ─────────────────────────────────────────────
// Delete an ID card by MongoDB _id
export async function DELETE(request, { params }) {
  try {
    await connectDB();

    const { id } = params;
    const deleted = await IDCard.findByIdAndDelete(id);

    if (!deleted) {
      return Response.json(
        { success: false, error: "ID Card not found" },
        { status: 404 }
      );
    }

    return Response.json({
      success: true,
      message: "ID Card deleted successfully",
    });
  } catch (error) {
    console.error("DELETE /api/idcards/[id] error:", error);
    return Response.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
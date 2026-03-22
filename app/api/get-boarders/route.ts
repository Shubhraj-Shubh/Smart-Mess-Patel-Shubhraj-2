import { NextRequest, NextResponse } from "next/server";
import Boarder from "@/models/Boarder";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "50");

    const skip = (page - 1) * limit;

    const boarders = await Boarder.find()
      .sort({ cardNo: -1 })
      .skip(skip)
      .limit(limit);

    if (!boarders) {
      return NextResponse.json(
        {
          data: [],
        },
        { status: 200 }
      );
    }

    return NextResponse.json(
      {
        data: boarders,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error getting boarders data:", error);

    return NextResponse.json(
      {
        error: "Failed to fetch user data",
      },
      { status: 500 }
    );
  }
}

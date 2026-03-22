import { NextResponse } from "next/server";
import Boarder from "@/models/Boarder";

export async function GET() {
  try {
    const count = await Boarder.countDocuments();

    return NextResponse.json(
      {
        count,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error getting users data:", error);

    return NextResponse.json(
      {
        error: "Failed to fetch user data",
      },
      { status: 500 }
    );
  }
}

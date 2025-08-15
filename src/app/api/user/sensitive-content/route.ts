import { type NextRequest, NextResponse } from "next/server";
import { auth } from "~/server/auth";
import { db } from "~/server/db";
import { z } from "zod";

const toggleSchema = z.object({
  contentPreference: z.enum(["ALL", "SAFE_ONLY", "ADULT_ONLY"]),
});

export async function POST(req: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body: unknown = await req.json();
    const { contentPreference } = toggleSchema.parse(body);

    const updatedUser = await db.user.update({
      where: { id: session.user.id },
      data: { contentPreference },
      select: { contentPreference: true }
    });

    return NextResponse.json({ 
      success: true, 
      contentPreference: updatedUser.contentPreference 
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input" },
        { status: 400 }
      );
    }

    console.error("Toggle content preference error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const user = await db.user.findUnique({
      where: { id: session.user.id },
      select: { contentPreference: true }
    });

    return NextResponse.json({ 
      contentPreference: user?.contentPreference ?? "SAFE_ONLY" 
    });
  } catch (error) {
    console.error("Get content preference error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

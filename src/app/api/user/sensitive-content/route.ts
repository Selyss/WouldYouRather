import { type NextRequest, NextResponse } from "next/server";
import { auth } from "~/server/auth";
import { db } from "~/server/db";
import { z } from "zod";

const toggleSchema = z.object({
  showSensitiveContent: z.boolean(),
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
    const { showSensitiveContent } = toggleSchema.parse(body);

    const updatedUser = await db.user.update({
      where: { id: session.user.id },
      data: { showSensitiveContent },
      select: { showSensitiveContent: true }
    });

    return NextResponse.json({ 
      success: true, 
      showSensitiveContent: updatedUser.showSensitiveContent 
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input" },
        { status: 400 }
      );
    }

    console.error("Toggle sensitive content error:", error);
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
      select: { showSensitiveContent: true }
    });

    return NextResponse.json({ 
      showSensitiveContent: user?.showSensitiveContent ?? false 
    });
  } catch (error) {
    console.error("Get sensitive content preference error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

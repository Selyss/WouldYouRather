import { NextRequest, NextResponse } from "next/server";
import { auth } from "~/server/auth";
import { db } from "~/server/db";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Find questions the user hasn't voted on yet
    const unseenQuestion = await db.question.findFirst({
      where: {
        votes: {
          none: {
            userId: session.user.id,
          },
        },
      },
      orderBy: {
        createdAt: "desc", // You can change this to random() if your DB supports it
      },
      include: {
        author: {
          select: {
            username: true,
          },
        },
        _count: {
          select: {
            votes: true,
          },
        },
      },
    });

    if (!unseenQuestion) {
      return NextResponse.json(
        { message: "No more questions available" },
        { status: 200 }
      );
    }

    return NextResponse.json(unseenQuestion);
  } catch (error) {
    console.error("Error fetching unseen question:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

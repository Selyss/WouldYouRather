import { NextRequest, NextResponse } from "next/server";
import { auth } from "~/server/auth";
import { db } from "~/server/db";
import { z } from "zod";

const createQuestionSchema = z.object({
  optionA: z.string().min(1, "Option A cannot be empty").max(200, "Option A must be less than 200 characters"),
  optionB: z.string().min(1, "Option B cannot be empty").max(200, "Option B must be less than 200 characters"),
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

    const body = await req.json();
    const { optionA, optionB } = createQuestionSchema.parse(body);

    const question = await db.question.create({
      data: {
        optionA,
        optionB,
        authorId: session.user.id,
      },
      include: {
        author: {
          select: {
            username: true,
          },
        },
      },
    });

    return NextResponse.json(question, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0]?.message || "Invalid input" },
        { status: 400 }
      );
    }

    console.error("Create question error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

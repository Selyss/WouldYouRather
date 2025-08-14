import { type NextRequest, NextResponse } from "next/server";
import { auth } from "~/server/auth";
import { db } from "~/server/db";
import { z } from "zod";

const createQuestionSchema = z.object({
  optionA: z.string().min(1, "Option A cannot be empty").max(200, "Option A must be less than 200 characters"),
  optionB: z.string().min(1, "Option B cannot be empty").max(200, "Option B must be less than 200 characters"),
  prompt: z.string().min(1, "Prompt cannot be empty").max(100, "Prompt must be less than 100 characters").default("Would you rather..."),
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
    const { optionA, optionB, prompt } = createQuestionSchema.parse(body);

    const question = await db.question.create({
      data: {
        prompt,
        authorId: session.user.id,
        responses: {
          create: [
            { text: optionA, order: 0 },
            { text: optionB, order: 1 }
          ]
        }
      },
      include: {
        author: {
          select: {
            username: true,
          },
        },
        responses: {
          orderBy: { order: 'asc' }
        }
      },
    });

    return NextResponse.json(question, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0]?.message ?? "Invalid input" },
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

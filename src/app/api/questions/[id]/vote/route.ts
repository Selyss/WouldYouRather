import { type NextRequest, NextResponse } from "next/server";
import { auth } from "~/server/auth";
import { db } from "~/server/db";
import { z } from "zod";

const voteSchema = z.object({
  choice: z.enum(["A", "B"]),
});

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    const { id } = await params;
    const questionId = parseInt(id);
    if (isNaN(questionId)) {
      return NextResponse.json(
        { error: "Invalid question ID" },
        { status: 400 }
      );
    }

    const body: unknown = await req.json();
    const { choice } = voteSchema.parse(body);

    // Get the question with its responses to find the correct responseId
    const question = await db.question.findUnique({
      where: { id: questionId },
      include: {
        responses: {
          orderBy: { order: 'asc' }
        }
      }
    });

    if (!question) {
      return NextResponse.json(
        { error: "Question not found" },
        { status: 404 }
      );
    }

    // Map choice A/B to responseId based on order
    const responseIndex = choice === "A" ? 0 : 1;
    const targetResponse = question.responses[responseIndex];

    if (!targetResponse) {
      return NextResponse.json(
        { error: "Invalid choice for this question" },
        { status: 400 }
      );
    }

    // Check if user already voted on this question (only if logged in)
    if (userId) {
      // Check if user has voted on ANY response of this question
      const existingVote = await db.vote.findFirst({
        where: {
          userId: userId,
          response: {
            questionId: questionId
          }
        },
      });

      if (existingVote) {
        return NextResponse.json(
          { error: "You have already voted on this question" },
          { status: 400 }
        );
      }
    }

    // Create the vote (with or without userId)
    const voteData: any = {
      responseId: targetResponse.id,
    };

    if (userId) {
      voteData.userId = userId;
    }

    await db.vote.create({
      data: voteData,
    });

    // Get updated vote counts with response data
    const responsesWithCounts = await db.response.findMany({
      where: { questionId },
      include: {
        _count: {
          select: { votes: true }
        }
      },
      orderBy: { order: 'asc' },
      take: 2
    });

    const totalVotes = responsesWithCounts.reduce((sum, response) => sum + response._count.votes, 0);
    const aVotes = responsesWithCounts[0]?._count.votes ?? 0;
    const bVotes = responsesWithCounts[1]?._count.votes ?? 0;
    const aPercentage = totalVotes > 0 ? Math.round((aVotes / totalVotes) * 100) : 0;
    const bPercentage = totalVotes > 0 ? Math.round((bVotes / totalVotes) * 100) : 0;

    return NextResponse.json({
      success: true,
      results: {
        totalVotes,
        aVotes,
        bVotes,
        aPercentage,
        bPercentage,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid choice. Must be 'A' or 'B'" },
        { status: 400 }
      );
    }

    console.error("Vote submission error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

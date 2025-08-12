import { NextRequest, NextResponse } from "next/server";
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

    const body = await req.json();
    const { choice } = voteSchema.parse(body);

    // Check if user already voted on this question (only if logged in)
    if (userId) {
      const existingVote = await db.vote.findUnique({
        where: {
          questionId_userId: {
            questionId,
            userId,
          },
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
      questionId,
      choice,
    };

    if (userId) {
      voteData.userId = userId;
    }

    await db.vote.create({
      data: voteData,
    });

    // Get updated vote counts
    const [totalVotes, aVotes] = await Promise.all([
      db.vote.count({
        where: { questionId },
      }),
      db.vote.count({
        where: { questionId, choice: "A" },
      }),
    ]);

    const bVotes = totalVotes - aVotes;
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

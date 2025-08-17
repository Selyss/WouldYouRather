import { NextResponse } from "next/server";
import { auth } from "~/server/auth";
import { db } from "~/server/db";

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    // Get user with basic info
    const user = await db.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        username: true,
        createdAt: true,
        contentPreference: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Get user stats
    const [questionsCreated, votesCount, userQuestions] = await Promise.all([
      // Count questions created by user
      db.question.count({
        where: { authorId: userId },
      }),

      // Count votes cast by user
      db.vote.count({
        where: { userId: userId },
      }),

      // Get recent questions created by user
      db.question.findMany({
        where: { authorId: userId },
        include: {
          _count: {
            select: { votes: true },
          },
          responses: {
            select: {
              text: true,
              order: true,
            },
            orderBy: { order: 'asc' },
          },
        },
        orderBy: { createdAt: 'desc' },
        take: 10,
      }),
    ]);

    // Calculate points earned (1 point per vote received on user's questions)
    const pointsEarned = userQuestions.reduce((total, question) => {
      return total + question._count.votes;
    }, 0);

    // Get user rank (approximate)
    const usersWithMorePoints = await db.$queryRaw<[{ count: bigint }]>`
      SELECT COUNT(DISTINCT u.id) as count
      FROM "User" u
      LEFT JOIN "Question" q ON q."authorId" = u.id
      LEFT JOIN "Vote" v ON v."questionId" = q.id
      GROUP BY u.id
      HAVING COUNT(v.id) > ${pointsEarned}
    `;

    const rank = Number(usersWithMorePoints[0]?.count || 0) + 1;

    return NextResponse.json({
      user: {
        id: user.id,
        username: user.username,
        joinedAt: user.createdAt,
        contentPreference: user.contentPreference,
      },
      stats: {
        questionsCreated,
        votesCount,
        pointsEarned,
        rank,
      },
      recentQuestions: userQuestions.map(q => ({
        id: q.id,
        prompt: q.prompt,
        category: q.category,
        votes: q._count.votes,
        responses: q.responses,
        createdAt: q.createdAt,
      })),
    });
  } catch (error) {
    console.error("Profile API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

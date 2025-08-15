import { type NextRequest, NextResponse } from "next/server";
import { auth } from "~/server/auth";
import { db } from "~/server/db";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    let unseenQuestion;

    if (userId) {
      // Get user's sensitive content preference
      const user = await db.user.findUnique({
        where: { id: userId },
        select: { showSensitiveContent: true }
      });

      const showSensitive = user?.showSensitiveContent ?? false;

      // For logged-in users, find questions they haven't voted on yet
      unseenQuestion = await db.question.findFirst({
        where: {
          // Filter based on sensitive content preference
          sensitiveContent: showSensitive ? undefined : false,
          responses: {
            none: {
              votes: {
                some: {
                  userId: userId,
                },
              },
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        include: {
          author: {
            select: {
              username: true,
            },
          },
          responses: {
            orderBy: { order: 'asc' },
            include: {
              _count: {
                select: {
                  votes: true,
                },
              },
            },
          },
        },
      });
    } else {
      // For unsigned-in users, never show sensitive content
      const totalQuestions = await db.question.count({
        where: {
          sensitiveContent: false
        }
      });

      if (totalQuestions === 0) {
        return NextResponse.json(
          { message: "No questions available" },
          { status: 200 }
        );
      }

      const randomSkip = Math.floor(Math.random() * totalQuestions);

      unseenQuestion = await db.question.findFirst({
        skip: randomSkip,
        where: {
          sensitiveContent: false
        },
        include: {
          author: {
            select: {
              username: true,
            },
          },
          responses: {
            orderBy: { order: 'asc' },
            include: {
              _count: {
                select: {
                  votes: true,
                },
              },
            },
          },
        },
      });
    }

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

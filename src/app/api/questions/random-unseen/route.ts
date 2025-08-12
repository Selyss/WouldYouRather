import { NextRequest, NextResponse } from "next/server";
import { auth } from "~/server/auth";
import { db } from "~/server/db";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    let unseenQuestion;

    if (userId) {
      // For logged-in users, find questions they haven't voted on yet
      unseenQuestion = await db.question.findFirst({
        where: {
          votes: {
            none: {
              userId: userId,
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
          _count: {
            select: {
              votes: true,
            },
          },
        },
      });
    } else {
      // For signed-out users, get a fully random question
      const totalQuestions = await db.question.count();

      if (totalQuestions === 0) {
        return NextResponse.json(
          { message: "No questions available" },
          { status: 200 }
        );
      }

      const randomSkip = Math.floor(Math.random() * totalQuestions);

      unseenQuestion = await db.question.findFirst({
        skip: randomSkip,
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

import { type NextRequest, NextResponse } from "next/server";
import { db } from "~/server/db";
import { auth } from "~/server/auth";

export async function GET(
  request: NextRequest,
  { params }: { params: { category: string } }
) {
  try {
    const session = await auth();
    const { category } = params;
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const offset = (page - 1) * limit;

    // Validate category
    const validCategories = [
      "GENERAL", "ANIMALS", "CAREER", "ETHICS", "FOOD", "FUN", 
      "HEALTH", "MONEY", "POP_CULTURE", "RELATIONSHIPS", "SCI_FI", 
      "SUPERPOWERS", "TRAVEL"
    ];

    if (!validCategories.includes(category.toUpperCase())) {
      return NextResponse.json(
        { error: "Invalid category" },
        { status: 400 }
      );
    }

    // Get user's content preference if signed in
    let contentPreference = "SAFE_ONLY";
    if (session?.user?.id) {
      const user = await db.user.findUnique({
        where: { id: session.user.id },
        select: { contentPreference: true },
      });
      contentPreference = user?.contentPreference || "SAFE_ONLY";
    }

    // Build where clause based on content preference
    let sensitiveContentFilter = {};
    if (contentPreference === "SAFE_ONLY") {
      sensitiveContentFilter = { sensitiveContent: false };
    } else if (contentPreference === "ADULT_ONLY") {
      sensitiveContentFilter = { sensitiveContent: true };
    }
    // If contentPreference is "ALL", no filter is applied

    const questions = await db.question.findMany({
      where: {
        category: category.toUpperCase() as any,
        ...sensitiveContentFilter,
      },
      include: {
        author: {
          select: {
            username: true,
          },
        },
        responses: {
          orderBy: { order: 'asc' }
        },
        _count: {
          select: {
            votes: true,
          },
        },
      },
      orderBy: {
        score: 'desc',
      },
      skip: offset,
      take: limit,
    });

    // Get total count for pagination
    const totalCount = await db.question.count({
      where: {
        category: category.toUpperCase() as any,
        ...sensitiveContentFilter,
      },
    });

    return NextResponse.json({
      questions,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalCount / limit),
        totalCount,
        hasNext: page * limit < totalCount,
        hasPrev: page > 1,
      },
    });
  } catch (error) {
    console.error("Error fetching questions by category:", error);
    return NextResponse.json(
      { error: "Failed to fetch questions" },
      { status: 500 }
    );
  }
}

import { NextResponse } from "next/server";
import { db } from "~/server/db";

// Define the categories with their display information
const CATEGORIES = [
  { value: "GENERAL", label: "General", description: "Everyday choices and decisions", emoji: "🤔" },
  { value: "ANIMALS", label: "Animals", description: "Animal-related questions", emoji: "🐾" },
  { value: "CAREER", label: "Career", description: "Work and professional life", emoji: "💼" },
  { value: "ETHICS", label: "Ethics", description: "Moral and ethical dilemmas", emoji: "⚖️" },
  { value: "FOOD", label: "Food", description: "Culinary choices and preferences", emoji: "🍽️" },
  { value: "FUN", label: "Fun", description: "Entertainment and leisure", emoji: "🎉" },
  { value: "HEALTH", label: "Health", description: "Health and wellness topics", emoji: "🏥" },
  { value: "MONEY", label: "Money", description: "Financial decisions", emoji: "💰" },
  { value: "POP_CULTURE", label: "Pop Culture", description: "Movies, music, and trends", emoji: "🎬" },
  { value: "RELATIONSHIPS", label: "Relationships", description: "Love, friendship, and social connections", emoji: "💕" },
  { value: "SCI_FI", label: "Sci-Fi", description: "Science fiction scenarios", emoji: "🚀" },
  { value: "SUPERPOWERS", label: "Superpowers", description: "Superhero abilities and powers", emoji: "⚡" },
  { value: "TRAVEL", label: "Travel", description: "Adventures and destinations", emoji: "✈️" },
] as const;

export async function GET() {
  try {
    // Get question counts for each category
    const categoryCounts = await db.question.groupBy({
      by: ['category'],
      _count: {
        id: true,
      },
    });

    // Create a map of category counts
    const countMap = categoryCounts.reduce((acc, item) => {
      acc[item.category] = item._count.id;
      return acc;
    }, {} as Record<string, number>);

    // Combine category info with counts
    const categoriesWithCounts = CATEGORIES.map(category => ({
      ...category,
      count: countMap[category.value] || 0,
    }));

    return NextResponse.json({ categories: categoriesWithCounts });
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json(
      { error: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}

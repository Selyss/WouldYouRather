import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const prisma = new PrismaClient();

// Category mapping from JSON format to schema format
const categoryMapping = {
  'Animals': 'ANIMALS',
  'Career': 'CAREER', 
  'Ethics': 'ETHICS',
  'Food': 'FOOD',
  'Fun': 'FUN',
  'Health': 'HEALTH',
  'Money': 'MONEY',
  'Pop Culture': 'POP_CULTURE',
  'Relationships': 'RELATIONSHIPS',
  'Sci-Fi': 'SCI_FI',
  'Superpowers': 'SUPERPOWERS',
  'Travel': 'TRAVEL'
};

async function clearDatabase() {
  console.log('🗑️  Clearing existing data...');
  
  // Delete in correct order due to foreign key constraints
  await prisma.vote.deleteMany({});
  console.log('   ✓ Deleted all votes');
  
  await prisma.response.deleteMany({});
  console.log('   ✓ Deleted all responses');
  
  await prisma.question.deleteMany({});
  console.log('   ✓ Deleted all questions');
  
  await prisma.user.deleteMany({});
  console.log('   ✓ Deleted all users');
  
  console.log('✅ Database cleared successfully\n');
}

async function importQuestions(filePath) {
  console.log(`📥 Starting import from: ${filePath}`);
  
  if (!fs.existsSync(filePath)) {
    throw new Error(`File not found: ${filePath}`);
  }
  
  const fileContent = fs.readFileSync(filePath, 'utf8');
  const lines = fileContent.trim().split('\n');
  
  let imported = 0;
  let skipped = 0;
  
  for (const [index, line] of lines.entries()) {
    try {
      const data = JSON.parse(line);
      
      // Map category to schema format
      const category = categoryMapping[data.category] || 'GENERAL';
      
      // Create question with responses
      await prisma.question.create({
        data: {
          prompt: data.question,
          category: category,
          sensitiveContent: data.contains_sensitive_content || false,
          score: data.score || 0,
          createdAt: new Date(),
          // authorId is null for system questions
          responses: {
            create: data.responses.map(responseText => ({
              text: responseText
            }))
          }
        }
      });
      
      imported++;
      
      // Progress indicator
      if (imported % 100 === 0) {
        console.log(`   📈 Imported ${imported} questions...`);
      }
      
    } catch (error) {
      console.warn(`⚠️  Skipping line ${index + 1}: ${error.message}`);
      skipped++;
    }
  }
  
  return { imported, skipped };
}

async function main() {
  try {
    console.log('🚀 Starting database import process...\n');
    
    // Step 1: Clear existing data
    await clearDatabase();
    
    // Step 2: Import new data
    const filePath = process.argv[2] || path.join(__dirname, '..', '..', 'Downloads', 'wyr_two_responses.jsonl');
    const { imported, skipped } = await importQuestions(filePath);
    
    console.log('\n📊 Import Summary:');
    console.log(`   ✅ Successfully imported: ${imported} questions`);
    console.log(`   ⚠️  Skipped: ${skipped} questions`);
    console.log(`   🎯 Total processed: ${imported + skipped}`);
    
    // Step 3: Verify import
    const totalQuestions = await prisma.question.count();
    const totalResponses = await prisma.response.count();
    
    console.log('\n🔍 Database verification:');
    console.log(`   📝 Questions in database: ${totalQuestions}`);
    console.log(`   💬 Responses in database: ${totalResponses}`);
    
    console.log('\n🎉 Import completed successfully!');
    
  } catch (error) {
    console.error('❌ Import failed:', error.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the import
main();

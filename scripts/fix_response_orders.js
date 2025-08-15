import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function fixResponseOrders() {
  console.log('🔧 Fixing response order values...');
  
  // Get all questions with their responses
  const questions = await prisma.question.findMany({
    include: {
      responses: {
        orderBy: { id: 'asc' }
      }
    }
  });

  let fixed = 0;
  
  for (const question of questions) {
    if (question.responses.length === 2) {
      // Update first response to order 0
      await prisma.response.update({
        where: { id: question.responses[0].id },
        data: { order: 0 }
      });
      
      // Update second response to order 1  
      await prisma.response.update({
        where: { id: question.responses[1].id },
        data: { order: 1 }
      });
      
      fixed++;
      
      if (fixed % 100 === 0) {
        console.log(`   📈 Fixed ${fixed} questions...`);
      }
    }
  }
  
  console.log(`✅ Fixed order values for ${fixed} questions`);
  
  // Verify the fix
  const testQuestion = await prisma.question.findFirst({
    include: {
      responses: {
        orderBy: { order: 'asc' }
      }
    }
  });
  
  console.log('🔍 Verification:');
  console.log(`Question: ${testQuestion?.prompt}`);
  testQuestion?.responses.forEach((response, index) => {
    console.log(`  ${index === 0 ? 'A' : 'B'}: order=${response.order}, text="${response.text}"`);
  });
  
  await prisma.$disconnect();
}

fixResponseOrders().catch(console.error);

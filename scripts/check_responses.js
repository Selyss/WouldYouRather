import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkResponses() {
  const question = await prisma.question.findFirst({
    include: {
      responses: {
        orderBy: { id: 'asc' }
      }
    }
  });
  
  console.log('First question ID:', question?.id);
  console.log('First question prompt:', question?.prompt);
  console.log('Responses:');
  question?.responses.forEach((response, index) => {
    console.log(`  ${index}: id=${response.id}, order=${response.order}, text="${response.text}"`);
  });
  
  await prisma.$disconnect();
}

checkResponses().catch(console.error);

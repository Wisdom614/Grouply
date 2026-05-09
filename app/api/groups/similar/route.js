import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

let prisma;

function getPrisma() {
  if (!prisma) {
    const pool = new Pool({
      connectionString: process.env.DATABASE_URL,
    });
    const adapter = new PrismaPg(pool);
    prisma = new PrismaClient({ adapter });
  }
  return prisma;
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const tags = searchParams.get('tags')?.split(',') || [];
    const excludeId = searchParams.get('exclude');
    
    const prisma = getPrisma();
    
    const similarGroups = await prisma.group.findMany({
      where: {
        id: { not: excludeId },
        tags: { hasSome: tags }
      },
      take: 3,
    });
    
    return Response.json(similarGroups);
  } catch (error) {
    console.error("Similar API Error:", error);
    return Response.json({ error: "Failed to fetch similar groups" }, { status: 500 });
  }
}
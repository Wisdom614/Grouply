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

export async function GET() {
  try {
    const prisma = getPrisma();
    const groups = await prisma.group.findMany({
      take: 20,
      orderBy: { createdAt: "desc" },
    });
    
    return new Response(JSON.stringify(groups), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("API Error:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch groups", details: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const prisma = getPrisma();
    const group = await prisma.group.create({
      data: {
        name: body.name,
        description: body.description,
        platform: body.platform,
        platformUrl: body.platformUrl,
        tags: body.tags || [],
        memberCount: body.memberCount || 0,
        imageUrl: body.imageUrl,
        authorId: body.authorId || "temp-user",
      },
    });
    
    return new Response(JSON.stringify(group), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("POST Error:", error);
    return new Response(JSON.stringify({ error: "Failed to create group" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
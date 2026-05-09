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

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const prisma = getPrisma();
    const group = await prisma.group.findUnique({
      where: { id },
    });
    
    if (!group) {
      return Response.json({ error: "Group not found" }, { status: 404 });
    }
    
    return Response.json(group);
  } catch (error) {
    console.error("API Error:", error);
    return Response.json({ error: "Failed to fetch group" }, { status: 500 });
  }
}
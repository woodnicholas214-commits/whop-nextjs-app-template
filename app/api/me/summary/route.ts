import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserId } from '@/lib/auth';
import { computeSummary } from '@/lib/metrics';

export async function GET(req: Request) {
  const userId = await getUserId(req);
  const bets = await prisma.bet.findMany({ where: { userId } });
  return NextResponse.json(computeSummary(bets));
}
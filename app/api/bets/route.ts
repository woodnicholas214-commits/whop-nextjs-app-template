import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserId } from '@/lib/auth';

export async function GET(req: Request) {
  const userId = await getUserId(req);
  const bets = await prisma.bet.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  });
  return NextResponse.json(bets);
}

export async function POST(req: Request) {
  const userId = await getUserId(req);
  const b = await req.json();

  const need = ['market','pick','odds','stake','eventTime','book'] as const;
  for (const k of need) {
    if (b[k] === undefined || b[k] === '') {
      return NextResponse.json({ error: `Missing ${k}` }, { status: 400 });
    }
  }

  const bet = await prisma.bet.create({
    data: {
      userId,
      market: String(b.market),
      pick: String(b.pick),
      odds: Number(b.odds),
      stake: Number(b.stake),
      eventTime: new Date(b.eventTime),
      book: String(b.book),
      notes: b.notes ? String(b.notes) : null,
    },
  });

  return NextResponse.json({ id: bet.id });
}
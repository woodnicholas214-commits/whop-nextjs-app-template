import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserId } from '@/lib/auth';

export async function POST(req: Request, ctx: { params: { id: string } }) {
  const userId = await getUserId(req);
  const betId = Number(ctx.params.id);
  const body = await req.json();

  const bet = await prisma.bet.findFirst({ where: { id: betId, userId } });
  if (!bet) return NextResponse.json({ error: 'Bet not found' }, { status: 404 });

  const kind = String(body.kind);
  const amount = body.amount !== undefined ? Number(body.amount) : null;
  const realizedPL = body.realizedPL !== undefined ? Number(body.realizedPL) : null;

  await prisma.betAction.create({ data: { betId, kind, amount, realizedPL } });

  if (kind.startsWith('settle')) {
    let pl = 0;
    if (kind === 'settle:win')  pl = realizedPL ?? Math.abs(bet.stake * bet.odds) - bet.stake;
    if (kind === 'settle:loss') pl = realizedPL ?? -bet.stake;
    if (kind === 'settle:push' || kind === 'settle:void') pl = 0;
    await prisma.bet.update({ where: { id: bet.id }, data: { outcome: pl } });
  }

  return NextResponse.json({ ok: true });
}
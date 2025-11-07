import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';
import { computeSummary, streakFlame } from '../../../lib/metrics';

export const dynamic = 'force-dynamic';

type Row = {
  alias: string;
  winRate: number;
  roi: number;
  totalBets: number;
  streak: string;
  profileLink: string;
};

export async function GET() {
  const users = await prisma.user.findMany({
    where: { leaderboardOptIn: true },
    include: { bets: { orderBy: { createdAt: 'asc' } } },
  });

  const rows: Row[] = users.map((u: any): Row => {
    const s = computeSummary((u.bets as any[]).map((b) => ({
      stake: Number(b.stake),
      outcome: b.outcome as number | null | undefined,
    })));
    const outcomes: number[] = (u.bets as any[]).map((b) => Number(b.outcome ?? 0));

    return {
      alias: (u.alias as string) || (u.id as string),
      winRate: s.win_rate,
      roi: s.roi,
      totalBets: s.totalBets,
      streak: streakFlame(outcomes),
      // Replace with your real Whop product/membership link (can include affiliate params)
      profileLink: `https://whop.com/discover/your-company/edgeiq-bets?ref=YOUR_CODE`,
    };
  });

  rows.sort((a: Row, b: Row) => b.roi - a.roi);
  return NextResponse.json(rows);
}
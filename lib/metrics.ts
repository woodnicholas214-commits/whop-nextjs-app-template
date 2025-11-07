// edgeiq-bets/lib/metrics.ts

// Minimal shape we need for math
type BetLite = { stake: number; outcome: number | null | undefined };

export function computeSummary(bets: BetLite[]) {
  const totalBets = bets.length;

  const settled = bets.filter((b) => b.outcome !== null && b.outcome !== undefined);
  const wins = settled.filter((b) => (b.outcome ?? 0) > 0).length;
  const losses = settled.filter((b) => (b.outcome ?? 0) < 0).length;
  const pushes = settled.filter((b) => (b.outcome ?? 0) === 0).length;

  const totalStake = bets.reduce((s, b) => s + Number(b.stake || 0), 0);
  const totalProfit = bets.reduce((s, b) => s + Number(b.outcome ?? 0), 0);

  const winRate = totalBets ? (wins / totalBets) * 100 : 0;
  const roi = totalStake ? (totalProfit / totalStake) * 100 : 0;

  return {
    totalBets,
    wins,
    losses,
    pushes,
    win_rate: Number(winRate.toFixed(1)),
    roi: Number(roi.toFixed(1)),
    totalProfit: Number(totalProfit.toFixed(2)),
    totalStake: Number(totalStake.toFixed(2)),
  };
}

// Returns '🔥' if last 2+ outcomes are positive
export function streakFlame(outcomes: number[]) {
  let s = 0;
  for (let i = outcomes.length - 1; i >= 0; i--) {
    if (outcomes[i] > 0) s++;
    else break;
  }
  return s >= 2 ? '🔥' : '';
}
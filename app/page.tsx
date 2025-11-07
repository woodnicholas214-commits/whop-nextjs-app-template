export default function Home() {
  return (
    <main style={{padding: 24, fontFamily: 'ui-sans-serif, system-ui'}}>
      <h1 style={{fontSize: 24, fontWeight: 700}}>EdgeIQ Bets — Local Dev</h1>
      <p>Quick checks:</p>
      <ul>
        <li><a href="/api/bets?user=Nick">/api/bets?user=Nick</a></li>
        <li><a href="/api/leaderboard">/api/leaderboard</a></li>
      </ul>
    </main>
  );
}
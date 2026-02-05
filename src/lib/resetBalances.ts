export async function resetAllUserBalances() {
  const res = await fetch('http://localhost:4000/reset-balances', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  });
  return res.json();
}

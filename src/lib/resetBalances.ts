export async function resetAllUserBalances() {
  const backendUrl = (import.meta as any).env.VITE_BACKEND_URL || 'http://localhost:4000';
  const res = await fetch(`${backendUrl}/reset-balances`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  });
  return res.json();
}

export async function sendVerificationCode(email: string): Promise<{ success: boolean; debugCode?: string }> {
  try {
    const res = await fetch('/api/send-verification', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });
    if (res.ok) {
      // Backend may return a debug code in dev mode
      const data = await res.json().catch(() => ({} as any));
      return { success: true, debugCode: data?.code };
    }
    throw new Error('Failed sending verification');
  } catch (err) {
    // Fallback: simulate by storing a code in localStorage
    const code = String(Math.floor(100000 + Math.random() * 900000));
    try {
      localStorage.setItem(`__sim_verif_${email}`, code);
    } catch {}
    console.info('FALLBACK: simulated verification code for', email, '→', code);
    return { success: true, debugCode: code };
  }
}

export async function verifyCode(email: string, code: string): Promise<boolean> {
  try {
    const res = await fetch('/api/verify-code', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, code })
    });
    if (res.ok) {
      const data = await res.json().catch(() => ({} as any));
      return data?.verified ?? true;
    }
    throw new Error('Verification failed');
  } catch (err) {
    try {
      const stored = localStorage.getItem(`__sim_verif_${email}`);
      return stored === code;
    } catch {
      return false;
    }
  }
}

export function clearSimulatedCode(email: string) {
  try {
    localStorage.removeItem(`__sim_verif_${email}`);
  } catch {}
}

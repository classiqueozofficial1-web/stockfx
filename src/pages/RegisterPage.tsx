import { useState, useEffect, FormEvent } from 'react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Logo } from '../components/investment/Logo';
import { Mail, Lock } from 'lucide-react';
import { setCurrentUserFromProfile, apiRegister } from '../lib/session';
interface RegisterPageProps {
  onNavigate: (page: string) => void;
}
export function RegisterPage({ onNavigate }: RegisterPageProps) {
  const [isLoading, setIsLoading] = useState(false);

  // Form state
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Verification flow
  const [step, setStep] = useState<'form' | 'verify'>('form');
  const [sentCode, setSentCode] = useState<string | null>(null);
  const [codeInput, setCodeInput] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifyError, setVerifyError] = useState<string | null>(null);
  const [resendCooldown, setResendCooldown] = useState(0);

  useEffect(() => {
    let t: number | undefined;
    if (resendCooldown > 0) {
      t = window.setTimeout(() => setResendCooldown((c) => c - 1), 1000);
    }
    return () => {
      if (t) clearTimeout(t);
    };
  }, [resendCooldown]);

  const sendVerificationCode = (toEmail: string) => {
    const code = String(Math.floor(100000 + Math.random() * 900000));
    setSentCode(code);
    setResendCooldown(30);
    console.info('Simulated verification code for', toEmail, '→', code);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      // Start verification flow (simulate sending code)
      sendVerificationCode(email);
      setStep('verify');
    }, 800);
  };

  const handleVerify = async (e?: FormEvent) => {
    if (e) e.preventDefault();
    setIsVerifying(true);
    setVerifyError(null);
    setTimeout(async () => {
      if (codeInput.trim() === sentCode) {
        try {
          // Call the API to register the user
          const name = `${firstName} ${lastName}`.trim();
          const user = await apiRegister(name, email, password);
          setCurrentUserFromProfile(user);
          onNavigate('dashboard');
        } catch (err: any) {
          setVerifyError(err?.message || 'Registration failed');
        } finally {
          setIsVerifying(false);
        }
      } else {
        setIsVerifying(false);
        setVerifyError('The verification code is incorrect.');
      }
    }, 800);
  };

  const handleResend = () => {
    if (resendCooldown > 0) return;
    sendVerificationCode(email);
  };
  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative">

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div
          className="flex justify-center mb-6 cursor-pointer"
          onClick={() => onNavigate('landing')}>

          <div className="animate-logo-entrance">
            <Logo size="xl" />
          </div>
        </div>
        <h2 className="mt-2 text-center text-3xl font-bold tracking-tight text-slate-900">
          Create your account
        </h2>
        <p className="mt-2 text-center text-sm text-slate-600">
          Already have an account?{' '}
          <button
            onClick={() => onNavigate('login')}
            className="font-medium text-emerald-600 hover:text-emerald-500">

            Sign in
          </button>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="bg-white/90 backdrop-blur-sm py-8 px-4 shadow-xl shadow-slate-200/50 sm:rounded-xl sm:px-10 border border-slate-100">

          {step === 'form' && (
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="grid grid-cols-2 gap-4">
                <Input label="First Name" placeholder="John" required value={firstName} onChange={(e)=>setFirstName(e.target.value)} />
                <Input label="Last Name" placeholder="Doe" required value={lastName} onChange={(e)=>setLastName(e.target.value)} />
              </div>

              <Input
                label="Email address"
                type="email"
                placeholder="you@example.com"
                required
                leftIcon={<Mail className="h-5 w-5" />}
                value={email}
                onChange={(e)=>setEmail(e.target.value)} />


              <Input
                label="Password"
                type="password"
                placeholder="Create a password"
                required
                leftIcon={<Lock className="h-5 w-5" />}
                helperText="Must be at least 8 characters"
                value={password}
                onChange={(e)=>setPassword(e.target.value)} />


              <div className="flex items-start">
                <div className="flex h-5 items-center">
                  <input
                    id="terms"
                    name="terms"
                    type="checkbox"
                    required
                    className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500" />

                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="terms" className="font-medium text-slate-700">
                    I agree to the{' '}
                    <a
                      href="#"
                      className="text-emerald-600 hover:text-emerald-500">

                      Terms
                    </a>{' '}
                    and{' '}
                    <a
                      href="#"
                      className="text-emerald-600 hover:text-emerald-500">

                      Privacy Policy
                    </a>
                  </label>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full"
                size="lg"
                isLoading={isLoading}>

                Create Account
              </Button>
            </form>
          )}

          {step === 'verify' && (
            <>
              <form className="space-y-6" onSubmit={handleVerify}>
                <Input label="Verification code" placeholder="123456" required value={codeInput} onChange={(e)=>setCodeInput(e.target.value)} />

                {verifyError && <p className="text-sm text-red-600">{verifyError}</p>}

                {/* Debug: Show code for local dev */}
                {sentCode && (
                  <p className="text-xs text-emerald-600 text-center">DEV: Your code is <span className="font-mono font-bold">{sentCode}</span></p>
                )}

                <div className="flex items-center justify-between">
                  <Button variant="ghost" onClick={()=>setStep('form')}>Change email</Button>
                  <div className="flex items-center gap-3">
                    <button type="button" onClick={handleResend} disabled={resendCooldown > 0} className="text-sm text-slate-500 hover:text-slate-900">
                      {resendCooldown > 0 ? `Resend (${resendCooldown}s)` : 'Resend code'}
                    </button>
                    <Button type="submit" size="lg" isLoading={isVerifying}>Verify</Button>
                  </div>
                </div>
              </form>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          }
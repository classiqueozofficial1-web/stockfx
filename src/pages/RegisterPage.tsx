import { useState, useEffect, FormEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Logo } from '../components/investment/Logo';
import { Mail, Lock, CheckCircle2, AlertCircle } from 'lucide-react';
import { setCurrentUserFromProfile, apiRegister } from '../lib/session';

interface RegisterPageProps {
  onNavigate: (page: string) => void;
}

export function RegisterPage({ onNavigate }: RegisterPageProps) {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);

  // Form state
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);

  // Registration flow steps: 'form' | 'otp' | 'verified' | 'error'
  const [step, setStep] = useState<'form' | 'otp' | 'error'>('form');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successEmail, setSuccessEmail] = useState<string | null>(null);
  const [otp, setOtp] = useState('');
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

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: email.split('@')[0],
          email,
          password,
          firstName,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setErrorMessage(errorData.message || 'Registration failed');
        setStep('error');
        setIsLoading(false);
        return;
      }

      // Registration successful, show OTP verification
      setSuccessEmail(email);
      setStep('otp');
      setOtp('');
      setResendCooldown(30);
    } catch (err: any) {
      setErrorMessage(err.message || 'An error occurred');
      setStep('error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async (e: FormEvent) => {
    e.preventDefault();
    if (!otp || otp.length !== 6) {
      setErrorMessage(t('register.invalidOtp'));
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email: successEmail, 
          otp 
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setErrorMessage(errorData.message || t('register.invalidOtp'));
        return;
      }

      const data = await response.json();
      // Store token and redirect to dashboard
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      onNavigate('dashboard');
    } catch (err: any) {
      setErrorMessage(err.message || t('register.invalidOtp'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (resendCooldown > 0) return;
    
    try {
      const response = await fetch('/api/auth/resend-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: successEmail }),
      });

      if (response.ok) {
        setResendCooldown(30);
        setErrorMessage(null);
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.message);
      }
    } catch (err: any) {
      setErrorMessage(t('register.resendError'));
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative">
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-slate-50 to-blue-50 -z-10 md:via-slate-100" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div
          className="flex justify-center mb-6 cursor-pointer"
          onClick={() => onNavigate('landing')}>
          <div className="animate-logo-entrance">
            <Logo size="xl" />
          </div>
        </div>
        <h2 className="mt-2 text-center text-3xl font-bold tracking-tight text-slate-900">
          {step === 'otp' ? t('register.verifyEmail') : t('register.title')}
        </h2>
        <p className="mt-2 text-center text-sm text-slate-600">
          {step === 'otp' ? (
            <>We sent a verification code to <strong>{successEmail}</strong></>
          ) : (
            <>
              {t('register.subtitle')}{' '}
              <button
                onClick={() => onNavigate('login')}
                className="font-medium text-emerald-600 hover:text-emerald-500">
                {t('register.haveAccount')}
              </button>
            </>
          )}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="bg-white/90 backdrop-blur-sm py-8 px-4 shadow-xl shadow-slate-200/50 sm:rounded-xl sm:px-10 border border-slate-100">

          {step === 'form' && (
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="grid grid-cols-2 gap-4">
                <Input 
                  label={t('register.firstNameLabel')} 
                  placeholder={t('register.firstNamePlaceholder')} 
                  required 
                  value={firstName} 
                  onChange={(e) => setFirstName(e.target.value)} 
                />
                <Input 
                  label={t('register.lastNameLabel')} 
                  placeholder={t('register.lastNamePlaceholder')} 
                  required 
                  value={lastName} 
                  onChange={(e) => setLastName(e.target.value)} 
                />
              </div>

              <Input
                label={t('register.emailLabel')}
                type="email"
                placeholder={t('register.emailPlaceholder')}
                required
                leftIcon={<Mail className="h-5 w-5" />}
                value={email}
                onChange={(e) => setEmail(e.target.value)} 
              />

              <Input
                label={t('register.passwordLabel')}
                type="password"
                placeholder={t('register.passwordPlaceholder')}
                required
                leftIcon={<Lock className="h-5 w-5" />}
                helperText={t('register.passwordHelper')}
                value={password}
                onChange={(e) => setPassword(e.target.value)} 
              />

              <div className="flex items-start">
                <div className="flex h-5 items-center">
                  <input
                    id="terms"
                    name="terms"
                    type="checkbox"
                    required
                    checked={termsAccepted}
                    onChange={(e) => setTermsAccepted(e.target.checked)}
                    className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500" 
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="terms" className="font-medium text-slate-700">
                    {t('register.termsLabel')}{' '}
                    <a href="#" className="text-emerald-600 hover:text-emerald-500">
                      {t('register.terms')}
                    </a>{' '}
                    {t('register.and')}{' '}
                    <a href="#" className="text-emerald-600 hover:text-emerald-500">
                      {t('register.privacy')}
                    </a>
                  </label>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full"
                size="lg"
                isLoading={isLoading}>
                {t('register.createButton')}
              </Button>
            </form>
          )}

          {step === 'otp' && (
            <form className="space-y-6" onSubmit={handleVerifyOTP}>
              <div>
                <label htmlFor="otp" className="block text-sm font-medium text-slate-700">
                  {t('register.verifyEmail')}
                </label>
                <input
                  id="otp"
                  type="text"
                  inputMode="numeric"
                  placeholder={t('register.otpPlaceholder')}
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                  className="mt-1 block w-full rounded-lg border border-slate-300 px-4 py-2 text-center text-2xl tracking-widest font-bold text-slate-900 placeholder-slate-400 focus:border-emerald-500 focus:ring-emerald-500"
                />
                <p className="mt-2 text-sm text-slate-500 text-center">
                  {t('register.enterCode')}
                </p>
              </div>

              {errorMessage && (
                <div className="rounded-lg bg-red-50 p-4 text-sm text-red-800">
                  {errorMessage}
                </div>
              )}

              <Button
                type="submit"
                className="w-full"
                size="lg"
                isLoading={isLoading}>
                {t('register.verifyButton')}
              </Button>

              <p className="text-center text-sm text-slate-600">
                {resendCooldown > 0 ? (
                  <>
                    {t('register.resendIn', { seconds: resendCooldown })}
                  </>
                ) : (
                  <>
                    {t('register.enterCode').split('.')[0]}?{' '}
                    <button
                      type="button"
                      onClick={handleResendOTP}
                      className="font-medium text-emerald-600 hover:text-emerald-500">
                      {t('register.resendCode')}
                    </button>
                  </>
                )}
              </p>

              <Button
                type="button"
                onClick={() => {
                  setStep('form');
                  setSuccessEmail(null);
                  setOtp('');
                  setEmail('');
                  setPassword('');
                  setFirstName('');
                  setLastName('');
                  setErrorMessage(null);
                }}
                variant="outline"
                size="lg"
                className="w-full">
                {t('register.useDifferentEmail')}
              </Button>
            </form>
          )}

          {step === 'error' && (
            <div className="space-y-6">
              <div className="flex justify-center">
                <AlertCircle className="h-16 w-16 text-red-500" />
              </div>

              <div className="text-center space-y-4">
                <p className="text-red-600 font-medium">{errorMessage}</p>
              </div>

              <Button
                onClick={() => {
                  setStep('form');
                  setErrorMessage(null);
                }}
                size="lg"
                className="w-full">
                Try again
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
import { useState, FormEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Logo } from '../components/investment/Logo';
import { Mail, Lock, AlertCircle } from 'lucide-react';
import { addUser } from '../lib/userStore';

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

  // Registration flow steps: 'form' | 'verify' | 'verified' | 'error'
  const [step, setStep] = useState<'form' | 'verify' | 'verified' | 'error'>('form');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [registeredEmail, setRegisteredEmail] = useState<string>('');


  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const backendUrl = (import.meta as any).env.VITE_BACKEND_URL || 'http://localhost:4000';
      
      // Create abort controller with 15 second timeout
      const abortController = new AbortController();
      const timeoutId = setTimeout(() => abortController.abort(), 15000);
      
      // Call backend registration endpoint with email verification
      const response = await fetch(`${backendUrl}/api/auth/register-with-link`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.toLowerCase().trim(),
          password,
          firstName,
          lastName,
        }),
        signal: abortController.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Registration failed');
      }

      // Also save locally for demo purposes
      const fullName = `${firstName} ${lastName}`.trim();
      addUser({
        id: Date.now().toString(),
        name: fullName || email.split('@')[0],
        email: email.toLowerCase().trim(),
        password,
        status: 'active',
        createdAt: new Date().toISOString(),
        balance: 0,
        notifications: [],
        registrationStatus: 'pending',
        verified: false,
      });

      // Proceed to verification step
      setRegisteredEmail(email);
      setStep('verify');
    } catch (err: any) {
      if (err.name === 'AbortError') {
        setErrorMessage('Registration request timed out. Please try again.');
      } else if (err instanceof TypeError) {
        setErrorMessage('Network error. Please check your connection and try again.');
      } else {
        setErrorMessage(err.message || 'Registration failed');
      }
      setStep('error');
    } finally {
      setIsLoading(false);
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
          {step === 'verify' || step === 'verified' ? t('register.checkEmail') || 'Check Your Email' : t('register.title')}
        </h2>
        <p className="mt-2 text-center text-sm text-slate-600">
          {step === 'verify' ? (
            <>A verification link has been sent to <b>{registeredEmail}</b></>
          ) : step === 'verified' ? (
            <>Email verified! Redirecting to login...</>
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

          {step === 'verify' && (
            <div className="space-y-6">
              <div className="flex justify-center">
                <div className="h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center">
                  <Mail className="h-8 w-8 text-blue-600" />
                </div>
              </div>
              <div className="text-center space-y-4">
                <p className="text-slate-700 font-medium">Verify Your Email Address</p>
                <p className="text-slate-600 text-sm">
                  We've sent a verification link to <b>{registeredEmail}</b>. Please check your email and click the link to verify your account.
                </p>
                <p className="text-slate-500 text-xs">
                  Didn't receive the email? Check your spam folder or contact support.
                </p>
              </div>
              <Button
                onClick={() => {
                  setStep('verified');
                  setTimeout(() => {
                    onNavigate('login');
                  }, 2000);
                }}
                size="lg"
                className="w-full">
                Email Verified
              </Button>
              <button
                onClick={() => {
                  setStep('form');
                  setFirstName('');
                  setLastName('');
                  setEmail('');
                  setPassword('');
                  setTermsAccepted(false);
                }}
                className="w-full text-slate-600 hover:text-slate-700 text-sm">
                Back to Registration
              </button>
            </div>
          )}

          {step === 'verified' && (
            <div className="space-y-6">
              <div className="flex justify-center">
                <div className="h-16 w-16 bg-emerald-100 rounded-full flex items-center justify-center">
                  <svg className="h-8 w-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
              <div className="text-center space-y-4">
                <p className="text-emerald-600 font-medium">Email Verified Successfully!</p>
                <p className="text-slate-600">Redirecting to login...</p>
              </div>
            </div>
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
                  setFirstName('');
                  setLastName('');
                  setEmail('');
                  setPassword('');
                  setTermsAccepted(false);
                }}
                size="lg"
                className="w-full">
                Try Again
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
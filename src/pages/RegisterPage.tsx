import { useState, FormEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Logo } from '../components/investment/Logo';
import { Mail, Lock, AlertCircle } from 'lucide-react';
import { addUser, getUsers } from '../lib/userStore';
import { setCurrentUserFromProfile } from '../lib/session';

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

  // Registration flow steps: 'form' | 'success' | 'error'
  const [step, setStep] = useState<'form' | 'success' | 'error'>('form');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);


  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);

    try {
      // Check if email already exists
      const users = getUsers();
      if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
        setErrorMessage(t('register.emailExists') || 'Email already registered');
        setStep('error');
        setIsLoading(false);
        return;
      }

      // Create new user directly (no backend needed)
      const newUser = addUser({
        email: email.toLowerCase().trim(),
        password,
        firstName,
        lastName,
      });

      // Auto-verify users (admin can verify later if needed)
      newUser.verified = false;
      newUser.registrationStatus = 'pending';

      // Persist user and navigate to dashboard
      setCurrentUserFromProfile(newUser);
      setStep('success');
      
      // Auto-navigate after 1 second
      setTimeout(() => {
        onNavigate('login');
      }, 1000);
    } catch (err: any) {
      setErrorMessage(err.message || 'Registration failed');
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
          {step === 'success' ? t('register.welcome') || 'Welcome!' : t('register.title')}
        </h2>
        <p className="mt-2 text-center text-sm text-slate-600">
          {step === 'success' ? (
            <>Registration successful! Redirecting to login...</>
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

          {step === 'success' && (
            <div className="space-y-6">
              <div className="flex justify-center">
                <div className="h-16 w-16 bg-emerald-100 rounded-full flex items-center justify-center">
                  <svg className="h-8 w-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
              <div className="text-center space-y-4">
                <p className="text-emerald-600 font-medium">Account created successfully!</p>
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
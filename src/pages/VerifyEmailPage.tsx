import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '../components/ui/Button';
import { Logo } from '../components/investment/Logo';
import { CheckCircle2, AlertCircle, Loader, Mail } from 'lucide-react';


interface VerifyEmailPageProps {
  onNavigate: (page: string) => void;
}

export function VerifyEmailPage({ onNavigate }: VerifyEmailPageProps) {
  useTranslation();
  const [status, setStatus] = useState<'input' | 'loading' | 'success' | 'error'>('input');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [code, setCode] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [verifyEmail, setVerifyEmail] = useState<string>('');

  useEffect(() => {
    // Check if user was just redirected from registration
    const urlParams = new URLSearchParams(window.location.search);
    const emailFromUrl = urlParams.get('email');
    if (emailFromUrl) {
      setVerifyEmail(decodeURIComponent(emailFromUrl));
    }
  }, []);

  const handleSubmitCode = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!verifyEmail.trim() || !code.trim()) {
      setErrorMessage('Please enter your email and verification code');
      return;
    }

    if (code.length !== 6 || !/^\d+$/.test(code)) {
      setErrorMessage('Verification code must be 6 digits');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const backendUrl = (import.meta as any).env.VITE_BACKEND_URL || 'http://localhost:4000';
      const response = await fetch(`${backendUrl}/api/auth/verify-code`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email: verifyEmail, 
          code: code 
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrorMessage(data.message || 'Verification failed. Please try again.');
        setStatus('error');
        return;
      }

      // Store JWT token and user info
      if (data.token) {
        localStorage.setItem('auth_token', data.token);
        localStorage.setItem('currentUser', JSON.stringify({
          id: data.user.id,
          email: data.user.email,
          name: `${data.user.firstName} ${data.user.lastName}`.trim(),
          firstName: data.user.firstName,
          lastName: data.user.lastName,
          verified: true,
          status: 'active',
          password: '',
          createdAt: new Date().toISOString(),
          balance: data.user.balance || 0,
          notifications: [],
          registrationStatus: 'confirmed',
        }));
        setEmail(data.user.email);
      }
      
      setStatus('success');

      // Auto-navigate to dashboard after 2 seconds
      setTimeout(() => {
        onNavigate('dashboard');
      }, 2000);
    } catch (err: any) {
      setErrorMessage(err.message || 'An error occurred during verification');
      setStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendCode = async () => {
    if (!verifyEmail.trim()) {
      setErrorMessage('Please enter your email address first');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const backendUrl = (import.meta as any).env.VITE_BACKEND_URL || 'http://localhost:4000';
      const response = await fetch(`${backendUrl}/api/auth/resend-verification-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: verifyEmail }),
      });

      const data = await response.json();

      if (response.ok) {
        setErrorMessage('');
        setStatus('input');
        setCode('');
        alert('✅ New verification code sent to your email. Check your inbox and spam folder.');
      } else {
        setErrorMessage(data.message || 'Failed to resend verification code');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to resend verification code');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative">
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-slate-50 to-blue-50 -z-10 md:via-slate-100" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div
          className="flex justify-center mb-6 cursor-pointer"
          onClick={() => onNavigate('landing')}
        >
          <div className="animate-logo-entrance">
            <Logo size="xl" />
          </div>
        </div>
        <h2 className="mt-2 text-center text-3xl font-bold tracking-tight text-slate-900">
          {status === 'input' && 'Verify Your Email'}
          {status === 'loading' && 'Verifying...'}
          {status === 'success' && 'Email verified!'}
          {status === 'error' && 'Verification Failed'}
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="bg-white/90 backdrop-blur-sm py-8 px-4 shadow-xl shadow-slate-200/50 sm:rounded-xl sm:px-10 border border-slate-100">
          {status === 'input' && (
            <div className="space-y-6">
              <div className="flex justify-center">
                <Mail className="h-12 w-12 text-emerald-600" />
              </div>

              <div className="text-center">
                <p className="text-slate-600 text-sm">
                  We've sent a 6-digit verification code to your email. Enter it below to verify your account.
                </p>
              </div>

              <form onSubmit={handleSubmitCode} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={verifyEmail}
                    onChange={(e) => setVerifyEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Verification Code
                  </label>
                  <input
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    placeholder="000000"
                    maxLength={6}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-center text-2xl tracking-widest font-mono"
                  />
                  <p className="text-xs text-slate-500 mt-2">Enter 6 digits from your email</p>
                </div>

                {errorMessage && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                    <p className="text-red-700 text-sm">{errorMessage}</p>
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  size="lg"
                  className="w-full"
                >
                  {isSubmitting ? 'Verifying...' : 'Verify Email'}
                </Button>
              </form>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-slate-600">Or</span>
                </div>
              </div>

              <Button
                onClick={handleResendCode}
                disabled={isSubmitting}
                variant="outline"
                size="lg"
                className="w-full"
              >
                Resend Code
              </Button>

              <Button
                onClick={() => onNavigate('login')}
                variant="ghost"
                size="sm"
                className="w-full text-slate-600"
              >
                Already verified? Go to Login
              </Button>
            </div>
          )}

          {status === 'loading' && (
            <div className="flex flex-col items-center justify-center space-y-6 py-10">
              <Loader className="h-12 w-12 text-emerald-600 animate-spin" />
              <p className="text-slate-600 text-center">
                Please wait while we verify your email...
              </p>
            </div>
          )}

          {status === 'success' && (
            <div className="space-y-6">
              <div className="flex justify-center">
                <CheckCircle2 className="h-16 w-16 text-emerald-500" />
              </div>

              <div className="text-center space-y-3">
                <p className="text-slate-700 font-medium">
                  {email && <>Your email <strong>{email}</strong> has been verified!</>}
                  {!email && <>Your email has been verified!</>}
                </p>
                <p className="text-sm text-slate-600">
                  You can now log in to your account.
                </p>
              </div>

              <Button
                onClick={() => onNavigate('login')}
                size="lg"
                className="w-full"
              >
                Go to Dashboard
              </Button>
            </div>
          )}

          {status === 'error' && (
            <div className="space-y-6">
              <div className="flex justify-center">
                <AlertCircle className="h-16 w-16 text-red-500" />
              </div>

              <div className="text-center space-y-4">
                <p className="text-red-600 font-medium">{errorMessage}</p>
                <p className="text-sm text-slate-600">
                  The code may have expired. Request a new one below.
                </p>
              </div>

              <div className="space-y-3">
                <Button
                  onClick={handleResendCode}
                  disabled={isSubmitting}
                  size="lg"
                  className="w-full"
                >
                  {isSubmitting ? 'Sending...' : 'Request New Code'}
                </Button>
                <Button
                  onClick={() => onNavigate('login')}
                  variant="outline"
                  size="lg"
                  className="w-full"
                >
                  Back to login
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

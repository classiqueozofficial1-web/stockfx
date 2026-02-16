import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '../components/ui/Button';
import { Logo } from '../components/investment/Logo';
import { CheckCircle2, AlertCircle, Loader } from 'lucide-react';
import { setCurrentUserFromProfile } from '../lib/session';

interface VerifyEmailPageProps {
  onNavigate: (page: string) => void;
}

export function VerifyEmailPage({ onNavigate }: VerifyEmailPageProps) {
  const { t } = useTranslation();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [email, setEmail] = useState<string>('');

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        // Get token from URL query parameter
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');
        const emailParam = urlParams.get('email');

        if (!token) {
          setErrorMessage('Invalid verification link');
          setStatus('error');
          return;
        }

        setEmail(emailParam || 'your email');

        // Call the verification endpoint
        const response = await fetch('/api/auth/verify-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          setErrorMessage(
            errorData.message || 'Verification failed. The link may have expired.'
          );
          setStatus('error');
          return;
        }

        const data = await response.json();
        setStatus('success');

        // Auto-navigate to login after 3 seconds
        setTimeout(() => {
          onNavigate('login');
        }, 3000);
      } catch (err: any) {
        setErrorMessage(err.message || 'An error occurred during verification');
        setStatus('error');
      }
    };

    verifyEmail();
  }, [onNavigate]);

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
          {status === 'loading' && 'Verifying your email...'}
          {status === 'success' && 'Email verified!'}
          {status === 'error' && 'Verification failed'}
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="bg-white/90 backdrop-blur-sm py-8 px-4 shadow-xl shadow-slate-200/50 sm:rounded-xl sm:px-10 border border-slate-100">
          {status === 'loading' && (
            <div className="flex flex-col items-center justify-center space-y-6 py-10">
              <Loader className="h-12 w-12 text-emerald-600 animate-spin" />
              <p className="text-slate-600 text-center">
                Please wait while we verify your email address...
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
                  You can now log in to your account. Redirecting in a few seconds...
                </p>
              </div>

              <Button
                onClick={() => onNavigate('login')}
                size="lg"
                className="w-full"
              >
                Go to Login
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
                  This link may have expired or already been used. Please try registering again.
                </p>
              </div>

              <div className="space-y-3">
                <Button
                  onClick={() => onNavigate('register')}
                  size="lg"
                  className="w-full"
                >
                  Register again
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

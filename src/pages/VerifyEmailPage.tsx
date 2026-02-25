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
  const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'no-token'>('loading');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [manualEmail, setManualEmail] = useState<string>('');
  const [isResending, setIsResending] = useState(false);
  const [resendMessage, setResendMessage] = useState<string>('');

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        // Get token from URL query parameter
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');

        if (!token) {
          setStatus('no-token');
          return;
        }

        const backendUrl = (import.meta as any).env.VITE_BACKEND_URL || 'http://localhost:4000';

        // Call the verification endpoint with GET request
        const response = await fetch(`${backendUrl}/api/auth/verify-email?token=${token}`, {
          method: 'GET',
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

        // Store JWT token and user info with correct localStorage keys
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

        // Auto-navigate to dashboard after 2 seconds (automatically logged in with JWT)
        setTimeout(() => {
          onNavigate('dashboard');
        }, 2000);
      } catch (err: any) {
        setErrorMessage(err.message || 'An error occurred during verification');
        setStatus('error');
      }
    };

    verifyEmail();
  }, [onNavigate]);

  const handleResendEmail = async () => {
    if (!manualEmail.trim()) {
      setResendMessage('Please enter your email address');
      return;
    }

    setIsResending(true);
    setResendMessage('');

    try {
      const backendUrl = (import.meta as any).env.VITE_BACKEND_URL || 'http://localhost:4000';
      const response = await fetch(`${backendUrl}/api/auth/resend-verification-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: manualEmail }),
      });

      const data = await response.json();

      if (!response.ok) {
        setResendMessage('Error: ' + (data.message || 'Failed to resend email'));
        return;
      }

      setResendMessage('✅ Verification email sent! Check your inbox and spam folder.');
      setManualEmail('');
    } catch (err: any) {
      setResendMessage('Error: ' + (err.message || 'Failed to resend email'));
    } finally {
      setIsResending(false);
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
          {status === 'loading' && 'Verifying your email...'}
          {status === 'success' && 'Email verified!'}
          {status === 'error' && 'Verification failed'}
          {status === 'no-token' && 'Verify your email'}
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
                  This link may have expired or already been used. Try requesting a new verification email below.
                </p>
              </div>

              <div className="space-y-4 pt-4 border-t border-slate-200">
                <p className="text-sm font-medium text-slate-700">Request a new verification email:</p>
                <div className="space-y-3">
                  <input
                    type="email"
                    placeholder="Enter your email address"
                    value={manualEmail}
                    onChange={(e) => setManualEmail(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <Button
                    onClick={handleResendEmail}
                    disabled={isResending}
                    size="lg"
                    className="w-full"
                  >
                    {isResending ? 'Sending...' : 'Resend Verification Email'}
                  </Button>
                  {resendMessage && (
                    <p className={`text-sm text-center ${resendMessage.includes('✅') ? 'text-emerald-600' : 'text-red-600'}`}>
                      {resendMessage}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-3 pt-4 border-t border-slate-200">
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

          {status === 'no-token' && (
            <div className="space-y-6">
              <div className="flex justify-center">
                <Mail className="h-16 w-16 text-blue-500" />
              </div>

              <div className="text-center space-y-3">
                <p className="text-slate-700 font-medium">Email Verification</p>
                <p className="text-sm text-slate-600">
                  Enter your email address to request a verification link.
                </p>
              </div>

              <div className="space-y-3">
                <input
                  type="email"
                  placeholder="Enter your email address"
                  value={manualEmail}
                  onChange={(e) => setManualEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <Button
                  onClick={handleResendEmail}
                  disabled={isResending}
                  size="lg"
                  className="w-full"
                >
                  {isResending ? 'Sending...' : 'Send Verification Email'}
                </Button>
                {resendMessage && (
                  <p className={`text-sm text-center ${resendMessage.includes('✅') ? 'text-emerald-600' : 'text-red-600'}`}>
                    {resendMessage}
                  </p>
                )}
              </div>

              <Button
                onClick={() => onNavigate('login')}
                variant="outline"
                size="lg"
                className="w-full"
              >
                Back to login
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

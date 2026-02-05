import { Navbar } from '../components/investment/Navbar';

interface TermsPageProps {
  onNavigate: (page: string) => void;
}

export function TermsPage({ onNavigate }: TermsPageProps) {
  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <Navbar onNavigate={onNavigate} />
      <main className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-4">Terms of Service</h1>
        <p className="text-sm text-slate-600 mb-6">Effective date: January 1, 2026</p>

        <section className="space-y-4 mb-6">
          <h2 className="text-xl font-semibold">Acceptance of Terms</h2>
          <p className="text-sm text-slate-600">These Terms govern your access to and use of StockFx services. By accessing or using our services, you agree to these Terms. If you do not agree, do not use our services.</p>
        </section>

        <section className="space-y-4 mb-6">
          <h2 className="text-xl font-semibold">Eligibility</h2>
          <p className="text-sm text-slate-600">You must be of legal age and able to form contracts in your jurisdiction to use our services. Certain features, including brokerage accounts or margin trading, may have additional eligibility requirements.</p>
        </section>

        <section className="space-y-4 mb-6">
          <h2 className="text-xl font-semibold">Account & Fees</h2>
          <p className="text-sm text-slate-600">You are responsible for maintaining the confidentiality of your account. We may charge fees for certain services (which will be disclosed separately). We reserve the right to change fees with notice as required by law.</p>
        </section>

        <section className="space-y-4 mb-6">
          <h2 className="text-xl font-semibold">Orders & Execution</h2>
          <p className="text-sm text-slate-600">Order execution depends on market conditions and third-party routing. We endeavor to execute orders promptly but cannot guarantee execution price or availability for all instruments.</p>
        </section>

        <section className="space-y-4 mb-6">
          <h2 className="text-xl font-semibold">Limitation of Liability</h2>
          <p className="text-sm text-slate-600">To the fullest extent permitted by law, StockFx and its affiliates are not liable for indirect, incidental, or consequential damages arising from your use of the services. Please review the full terms for exceptions and details.</p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Governing Law & Disputes</h2>
          <p className="text-sm text-slate-600">Any disputes under these Terms will be governed by the laws set out in the full agreement. Specific dispute resolution mechanisms, including arbitration clauses, are described in the complete Terms.</p>
        </section>
      </main>
    </div>
  );
}

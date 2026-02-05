import { Navbar } from '../components/investment/Navbar';

interface PrivacyPageProps {
  onNavigate: (page: string) => void;
}

export function PrivacyPage({ onNavigate }: PrivacyPageProps) {
  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <Navbar onNavigate={onNavigate} />
      <main className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-4">Privacy Policy</h1>
        <p className="text-sm text-slate-600 mb-6">Effective date: January 1, 2026</p>

        <section className="space-y-4 mb-6">
          <h2 className="text-xl font-semibold">Overview</h2>
          <p className="text-sm text-slate-600">We respect your privacy and are committed to protecting your personal information. This Privacy Policy explains what information we collect, how we use it, how we share it, and the choices you have regarding your data when using StockFx and related services.</p>
        </section>

        <section className="space-y-4 mb-6">
          <h2 className="text-xl font-semibold">Information We Collect</h2>
          <p className="text-sm text-slate-600">We collect information you provide directly (such as account registration data, identity verification documents, and correspondence), information about your transactions and account activity, and technical information (device identifiers, IP addresses, and log data). We may also aggregate and anonymize data for analytics and product improvement.</p>
        </section>

        <section className="space-y-4 mb-6">
          <h2 className="text-xl font-semibold">How We Use Information</h2>
          <p className="text-sm text-slate-600">We use your information to provide and improve our services, process transactions, communicate with you, comply with legal and regulatory requirements (including anti‑money laundering and customer identification), and to detect and prevent fraud. Where required, we will obtain your consent before using your data for other purposes.</p>
        </section>

        <section className="space-y-4 mb-6">
          <h2 className="text-xl font-semibold">Sharing and Disclosure</h2>
          <p className="text-sm text-slate-600">We may share information with service providers, financial institutions, regulators, and as required by law. We do not sell your personal data to third parties. For a detailed list of categories of recipients and the purposes for which we share, contact privacy@stockfx.example.</p>
        </section>

        <section className="space-y-4 mb-6">
          <h2 className="text-xl font-semibold">Security & Data Retention</h2>
          <p className="text-sm text-slate-600">We employ industry-standard safeguards, including encryption in transit and at rest, access controls, and regular security assessments. We retain personal data only as long as necessary to provide services, comply with legal obligations, and resolve disputes.</p>
        </section>

        <section className="space-y-4 mb-6">
          <h2 className="text-xl font-semibold">Your Rights</h2>
          <p className="text-sm text-slate-600">Depending on your jurisdiction, you may have rights to access, correct, or delete your personal data, and to object to certain processing. To exercise these rights or ask questions, contact <a href="mailto:privacy@stockfx.example" className="text-amber-500 hover:underline">privacy@stockfx.example</a>.</p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Contact</h2>
          <p className="text-sm text-slate-600">For privacy inquiries, please reach out to <a href="mailto:privacy@stockfx.example" className="text-amber-500 hover:underline">privacy@stockfx.example</a>.</p>
        </section>
      </main>
    </div>
  );
}

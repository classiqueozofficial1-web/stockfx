import { Navbar } from '../components/investment/Navbar';

interface CookiePolicyPageProps {
  onNavigate: (page: string) => void;
}

export function CookiePolicyPage({ onNavigate }: CookiePolicyPageProps) {
  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <Navbar onNavigate={onNavigate} />
      <main className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-4">Cookie Policy</h1>
        <p className="text-sm text-slate-600 mb-6">This Cookie Policy explains how StockFx uses cookies and similar technologies.</p>

        <section className="space-y-4 mb-6">
          <h2 className="text-xl font-semibold">What are cookies?</h2>
          <p className="text-sm text-slate-600">Cookies are small text files stored on your device that help us provide, personalize, and secure our services. They enable features like remembering preferences, analytics, and security.</p>
        </section>

        <section className="space-y-4 mb-6">
          <h2 className="text-xl font-semibold">Types of Cookies We Use</h2>
          <ul className="text-sm text-slate-600 list-disc ml-6 space-y-2">
            <li><strong>Essential:</strong> Required for site operation and security.</li>
            <li><strong>Analytics:</strong> Help us understand product usage and improve features.</li>
            <li><strong>Advertising:</strong> Used by third parties to provide relevant ads; you can opt out through browser settings.</li>
          </ul>
        </section>

        <section className="space-y-4 mb-6">
          <h2 className="text-xl font-semibold">Managing Cookies</h2>
          <p className="text-sm text-slate-600">You can control cookies through your browser settings and by managing preferences within the site when available. Disabling certain cookies may affect functionality.</p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Contact</h2>
          <p className="text-sm text-slate-600">Questions about cookies? Contact <a href="mailto:privacy@stockfx.example" className="text-amber-500 hover:underline">privacy@stockfx.example</a>.</p>
        </section>
      </main>
    </div>
  );
}

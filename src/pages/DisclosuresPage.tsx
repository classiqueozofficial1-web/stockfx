import { Navbar } from '../components/investment/Navbar';

interface DisclosuresPageProps {
  onNavigate: (page: string) => void;
}

export function DisclosuresPage({ onNavigate }: DisclosuresPageProps) {
  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <Navbar onNavigate={onNavigate} />
      <main className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-4">Disclosures</h1>
        <p className="text-sm text-slate-600 mb-6">Important disclosures regarding investing and the services provided by StockFx.</p>

        <section className="space-y-4 mb-6">
          <h2 className="text-xl font-semibold">Risk Disclosure</h2>
          <p className="text-sm text-slate-600">Investing in securities, derivatives, and cryptocurrencies involves risk, including the possible loss of principal. Past performance is not indicative of future results. You should carefully consider your investment objectives and risk tolerance before trading.</p>
        </section>

        <section className="space-y-4 mb-6">
          <h2 className="text-xl font-semibold">No Investment Advice</h2>
          <p className="text-sm text-slate-600">Content on our platforms is for informational purposes only and does not constitute investment advice, tax advice, or recommendations. Consider consulting a licensed financial professional for personalized advice.</p>
        </section>

        <section className="space-y-4 mb-6">
          <h2 className="text-xl font-semibold">Order Routing & Conflicts</h2>
          <p className="text-sm text-slate-600">We may route orders through third-party brokers or markets. We have policies to mitigate conflicts of interest and make disclosures where required by law; details are available on request.</p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Margin & Crypto Risks</h2>
          <p className="text-sm text-slate-600">Margin trading and crypto trading have unique risks, including leverage and market volatility. You may lose more than your initial investment when trading on margin or trading highly volatile instruments.</p>
        </section>
      </main>
    </div>
  );
}

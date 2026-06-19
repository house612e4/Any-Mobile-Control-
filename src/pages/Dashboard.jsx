import Container from '../components/common/Container';
import { useAuth } from '../hooks/useAuth';

export default function Dashboard() {
  const { user } = useAuth();
  const params = new URLSearchParams(window.location.search);
  const payment = params.get('payment');
  const gateway = params.get('gateway');

  return (
    <section className="py-20">
      <Container>
        <h1 className="text-4xl font-bold text-white">Dashboard</h1>
        <p className="mt-4 text-slate-300">Welcome, {user?.displayName || user?.email}</p>

        {payment === 'success' && (
          <div className="mt-6 rounded-2xl border border-emerald-400/30 bg-emerald-400/10 p-4 text-emerald-200">
            Payment successful{gateway ? ` via ${gateway}` : ''}.
          </div>
        )}
      </Container>
    </section>
  );
}
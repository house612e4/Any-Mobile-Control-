import { useEffect } from 'react';
import Container from '../components/common/Container';
import { useAuth } from '../hooks/useAuth';
import { markOrderStatus } from '../lib/payments-db';

export default function Dashboard() {
  const { user } = useAuth();

  const params = new URLSearchParams(window.location.search);
  const payment = params.get('payment');
  const gateway = params.get('gateway');
  const orderId = params.get('order_id') || params.get('tran_id');

  useEffect(() => {
    const syncPayment = async () => {
      if (payment === 'success' && orderId) {
        try {
          await markOrderStatus({
            orderId,
            status: 'paid',
            gatewayResponse: { gateway, payment },
          });
        } catch (error) {
          console.error(error);
        }
      }
    };

    syncPayment();
  }, [payment, gateway, orderId]);

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

        {payment === 'failed' && (
          <div className="mt-6 rounded-2xl border border-red-400/30 bg-red-400/10 p-4 text-red-200">
            Payment failed. Please try again.
          </div>
        )}
      </Container>
    </section>
  );
}
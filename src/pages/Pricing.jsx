import Container from '../components/common/Container';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { plans } from '../config/plans';
import { startSSLCommerzCheckout, startStripeCheckout } from '../lib/payments';
import { useAuth } from '../hooks/useAuth';

export default function Pricing() {
  const { user } = useAuth();

  const handleSSL = async (plan) => {
    try {
      await startSSLCommerzCheckout({ plan, user });
    } catch (error) {
      alert(error.message);
    }
  };

  const handleStripe = async (plan) => {
    try {
      await startStripeCheckout({ plan, user });
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <section className="py-20">
      <Container>
        <h1 className="text-4xl font-bold text-white">Pricing</h1>
        <p className="mt-4 text-slate-300">
          Choose a plan and complete your payment securely.
        </p>

        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {plans.map((plan) => (
            <Card key={plan.id}>
              <h2 className="text-2xl font-semibold text-white">{plan.name}</h2>
              <p className="mt-3 text-3xl font-black text-cyan-300">{plan.displayPrice}</p>
              <p className="mt-2 text-slate-300">{plan.credits} credits</p>

              <ul className="mt-5 space-y-2 text-sm text-slate-300">
                {plan.features.map((feature) => (
                  <li key={feature}>• {feature}</li>
                ))}
              </ul>

              <div className="mt-6 space-y-3">
                {plan.price === 0 ? (
                  <Button className="w-full">Start Free</Button>
                ) : (
                  <>
                    <Button className="w-full" onClick={() => handleSSL(plan)}>
                      Pay with SSLCommerz
                    </Button>
                    <Button
                      className="w-full"
                      variant="secondary"
                      onClick={() => handleStripe(plan)}
                    >
                      Pay with Stripe
                    </Button>
                  </>
                )}
              </div>
            </Card>
          ))}
        </div>
      </Container>
    </section>
  );
}
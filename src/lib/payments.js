import { postFunction } from './http';
import { createPendingOrder } from './payments-db';

export async function startSSLCommerzCheckout({ plan, user }) {
  const orderId = `MTS-${Date.now()}`;

  await createPendingOrder({
    orderId,
    userId: user?.uid,
    userName: user?.displayName,
    userEmail: user?.email,
    plan,
    gateway: 'sslcommerz',
  });

  const data = await postFunction('create-sslcommerz-session', {
    orderId,
    plan,
    customer: {
      name: user?.displayName || 'MT Studio Customer',
      email: user?.email || 'customer@example.com',
      phone: '0000000000',
      city: 'Dhaka',
      country: 'Bangladesh',
      address: 'N/A',
    },
  });

  if (!data?.gatewayUrl) {
    throw new Error('Payment gateway URL not received');
  }

  window.location.href = data.gatewayUrl;
}

export async function startStripeCheckout({ plan, user }) {
  const orderId = `MTS-${Date.now()}`;

  await createPendingOrder({
    orderId,
    userId: user?.uid,
    userName: user?.displayName,
    userEmail: user?.email,
    plan,
    gateway: 'stripe',
  });

  const data = await postFunction('create-stripe-session', {
    orderId,
    plan,
    customer: {
      name: user?.displayName || 'MT Studio Customer',
      email: user?.email || 'customer@example.com',
    },
  });

  if (!data?.url) {
    throw new Error('Stripe checkout URL not received');
  }

  window.location.href = data.url;
}
import { getBkashToken } from './_bkash.js';

export async function queryBkashPayment(paymentID) {
  const token = await getBkashToken();
  const baseUrl = process.env.BKASH_BASE_URL;

  const res = await fetch(`${baseUrl}/tokenized/checkout/payment/status`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      authorization: token,
      'x-app-key': process.env.BKASH_APP_KEY,
    },
    body: JSON.stringify({ paymentID }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data?.statusMessage || data?.message || 'Failed to query bKash payment');
  }

  return data;
}

export default async (request) => {
  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const { paymentID } = await request.json();
    const data = await queryBkashPayment(paymentID);

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
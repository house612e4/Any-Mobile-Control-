export default async (request) => {
  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const plan = await request.json();
    const siteUrl = process.env.SITE_URL || 'http://localhost:5173';

    const body = new URLSearchParams({
      mode: 'payment',
      success_url: `${siteUrl}/dashboard?payment=success&gateway=stripe`,
      cancel_url: `${siteUrl}/pricing?payment=cancelled&gateway=stripe`,
      'line_items[0][price_data][currency]': (plan.currency || 'BDT').toLowerCase(),
      'line_items[0][price_data][product_data][name]': `${plan.name} Plan`,
      'line_items[0][price_data][unit_amount]': String(plan.price * 100),
      'line_items[0][quantity]': '1',
      'metadata[plan_id]': plan.id,
      'metadata[credits]': String(plan.credits),
    });

    const res = await fetch('https://api.stripe.com/v1/checkout/sessions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.STRIPE_SECRET_KEY}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: body.toString(),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data?.error?.message || 'Failed to create Stripe session');
    }

    return new Response(JSON.stringify({ success: true, url: data.url, session: data }), {
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
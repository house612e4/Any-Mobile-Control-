export default async (request) => {
  try {
    const url = new URL(request.url);
    const valId = url.searchParams.get('val_id');
    const tranId = url.searchParams.get('tran_id');
    const siteUrl = process.env.SITE_URL || 'http://localhost:5173';

    const validationBase =
      process.env.SSLCOMMERZ_SANDBOX === 'true'
        ? 'https://sandbox.sslcommerz.com/validator/api/validationserverAPI.php'
        : 'https://securepay.sslcommerz.com/validator/api/validationserverAPI.php';

    const validationUrl =
      `${validationBase}?val_id=${encodeURIComponent(valId)}&store_id=${encodeURIComponent(process.env.SSLCOMMERZ_STORE_ID)}&store_passwd=${encodeURIComponent(process.env.SSLCOMMERZ_STORE_PASSWORD)}&format=json`;

    const res = await fetch(validationUrl);
    const data = await res.json();

    const redirectUrl =
      data?.status === 'VALID' || data?.status === 'VALIDATED'
        ? `${siteUrl}/dashboard?payment=success&tran_id=${encodeURIComponent(tranId)}`
        : `${siteUrl}/pricing?payment=invalid`;

    return Response.redirect(redirectUrl, 302);
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
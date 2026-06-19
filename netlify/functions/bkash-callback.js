import { executeBkashPayment } from './execute-bkash-payment.js';

export default async (request) => {
  try {
    const url = new URL(request.url);
    const paymentID = url.searchParams.get('paymentID');
    const status = url.searchParams.get('status');
    const siteUrl = process.env.SITE_URL || 'http://localhost:5173';

    if (!paymentID) {
      return Response.redirect(`${siteUrl}/pricing?payment=failed&gateway=bkash`, 302);
    }

    if (status !== 'success') {
      const redirectStatus = status === 'cancel' ? 'cancelled' : 'failed';
      return Response.redirect(
        `${siteUrl}/pricing?payment=${redirectStatus}&gateway=bkash`,
        302
      );
    }

    const execution = await executeBkashPayment(paymentID);
    const orderId = execution?.merchantInvoiceNumber || execution?.trxID || paymentID;

    const successRedirect =
      `${siteUrl}/dashboard?payment=success&gateway=bkash&order_id=${encodeURIComponent(orderId)}&paymentID=${encodeURIComponent(paymentID)}`;

    return Response.redirect(successRedirect, 302);
  } catch (error) {
    const siteUrl = process.env.SITE_URL || 'http://localhost:5173';
    return Response.redirect(
      `${siteUrl}/pricing?payment=failed&gateway=bkash&message=${encodeURIComponent(error.message)}`,
      302
    );
  }
};
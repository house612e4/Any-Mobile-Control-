import { doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { db } from './firebase';

export async function createPendingOrder({
  orderId,
  userId,
  userName,
  userEmail,
  plan,
  gateway,
}) {
  await setDoc(doc(db, 'orders', orderId), {
    orderId,
    userId: userId || null,
    userName: userName || 'Guest User',
    userEmail: userEmail || 'guest@example.com',
    planId: plan.id,
    planName: plan.name,
    amount: plan.price,
    currency: plan.currency || 'BDT',
    credits: plan.credits,
    gateway,
    status: 'pending',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

export async function markOrderStatus({
  orderId,
  status,
  gatewayResponse = null,
}) {
  await setDoc(
    doc(db, 'orders', orderId),
    {
      status,
      gatewayResponse,
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );
}
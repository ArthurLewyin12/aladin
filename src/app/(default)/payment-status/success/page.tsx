import { Suspense } from 'react';
import PaymentSuccessContent from './content';

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<div>Chargement...</div>}>
      <PaymentSuccessContent />
    </Suspense>
  );
}
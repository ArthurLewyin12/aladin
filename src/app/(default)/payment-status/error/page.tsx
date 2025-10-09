import { Suspense } from 'react';
import PaymentErrorContent from './content';

export default function PaymentErrorPage() {
  return (
    <Suspense fallback={<div>Chargement...</div>}>
      <PaymentErrorContent />
    </Suspense>
  );
}
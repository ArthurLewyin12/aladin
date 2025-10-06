import ForgotPasswordForm from "@/components/pages/auth/forgot-password-form";
import { Suspense } from "react";

export default function ForgotPasswordPage() {
  return (
    <Suspense fallback={<div>Chargement...</div>}>
      <ForgotPasswordForm />
    </Suspense>
  );
}

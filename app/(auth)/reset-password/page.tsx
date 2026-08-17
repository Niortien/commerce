import { Suspense } from "react";
import { ResetPasswordView } from "@/components/auth/ResetPasswordView";

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={null}>
      <ResetPasswordView />
    </Suspense>
  );
}

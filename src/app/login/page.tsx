import { Suspense } from "react";
import { LoginPage } from "@/components/dashboard/LoginPage";

export const metadata = {
  title: "Login | NIPPUR Pharma",
  description: "Admin Login",
  robots: { index: false, follow: false },
};

export default function LoginRoute() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-brand-950 flex items-center justify-center text-white">Loading...</div>}>
      <LoginPage />
    </Suspense>
  );
}

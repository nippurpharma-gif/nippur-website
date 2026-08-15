import type { ReactNode } from "react";

export const metadata = {
  title: "Admin Dashboard | NIPPUR Pharma",
  description: "Secure administration panel for NIPPUR Pharma.",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {children}
    </div>
  );
}

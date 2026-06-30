import type { Metadata } from "next";
import { Geist, Geist_Mono, Cairo } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { AppProvider } from "@/components/layout/AppProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const cairo = Cairo({
  variable: "--font-cairo",
  subsets: ["arabic", "latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "NIPPUR Pharma — Iraq's Next-Generation Pharmaceutical Manufacturer",
  description:
    "NIPPUR Pharma combines Iraq's ancient legacy of healing with cutting-edge European GMP manufacturing technology to deliver world-class pharmaceutical products.",
  keywords: [
    "NIPPUR Pharma",
    "pharmaceutical",
    "Iraq",
    "GMP",
    "cephalosporin",
    "medicine",
    "manufacturing",
    "healthcare",
  ],
  authors: [{ name: "NIPPUR Pharma" }],
  openGraph: {
    title: "NIPPUR Pharma — Iraq's Pharmaceutical Manufacturer",
    description: "World-class pharmaceutical manufacturing in Iraq with European GMP technology.",
    siteName: "NIPPUR Pharma",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${cairo.variable} antialiased bg-background text-foreground`}
        suppressHydrationWarning
      >
        <AppProvider>{children}</AppProvider>
        <Toaster />
      </body>
    </html>
  );
}
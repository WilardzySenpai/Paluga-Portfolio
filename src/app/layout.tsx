// premium-portfolio/src/app/layout.tsx
import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import ClientBody from "./ClientBody";
import { ThemeProvider } from "@/components/theme-provider";
// Import Sonner Toaster instead of shadcn Toaster
import { Toaster as SonnerToaster } from "sonner";

// Remove Geist variables setup here if using the recommended import method
// const geistSans = Geist({ ... });
// const geistMono = Geist_Mono({ ... });

export const metadata: Metadata = {
  title: "Premium Developer Portfolio",
  description: "Full-Stack Architect Building Scalable Solutions",
  keywords: ["developer", "portfolio", "full-stack", "developer", "react", "next.js", "bun"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // Apply font classes directly to html tag using Geist's recommended method
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`} suppressHydrationWarning>
      <ClientBody>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
          {/* Use Sonner Toaster */}
          <SonnerToaster richColors position="bottom-right" />
        </ThemeProvider>
      </ClientBody>
    </html>
  );
}
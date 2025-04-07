// src/app/ClientBody.tsx

"use client";

import { useEffect } from "react";

export default function ClientBody({
  children,
}: {
  children: React.ReactNode;
}) {
  // Remove any extension-added classes during hydration
  useEffect(() => {
    // This runs only on the client after hydration
    // Let Tailwind manage the body classes, just ensure a base class if needed
    // document.body.className = "antialiased"; // Keep Tailwind classes
  }, []);

  // Apply Tailwind classes directly here. ThemeProvider will handle dark/light.
  return (
    <body className="antialiased bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50 transition-colors" suppressHydrationWarning>
      {children}
    </body>
  );
}
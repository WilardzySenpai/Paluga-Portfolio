// premium-portfolio/src/components/theme-provider.tsx
"use client"

import * as React from "react"; // Import React
import { ThemeProvider as NextThemesProvider } from "next-themes";
import type { ThemeProviderProps } from "next-themes/dist/types";

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  // Ensure props include necessary defaults if not provided
  const finalProps = {
    attribute: "class",
    defaultTheme: "system",
    enableSystem: true,
    ...props, // Allow overriding defaults
  };

  return <NextThemesProvider {...finalProps}>{children}</NextThemesProvider>;
}
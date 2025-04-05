// premium-portfolio/src/components/theme-switcher.tsx
"use client"

import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { SunIcon, MoonIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion" // Added AnimatePresence

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Avoid hydration mismatch by waiting for mount
  useEffect(() => {
    setMounted(true)
  }, [])

  // Render a placeholder or null until mounted
  if (!mounted) {
    // Render a simple placeholder to avoid layout shift
    return <div className="h-10 w-10 rounded-full" aria-hidden="true" />;
    // Or return null;
    // return null;
  }

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <div className="relative flex items-center justify-center h-10 w-10"> {/* Container for positioning */}
      <AnimatePresence mode="wait" initial={false}> {/* Wait for exit animation */}
        <motion.button
          key={theme === 'dark' ? 'moon' : 'sun'} // Key change triggers animation
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          className="absolute inset-0 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" // Focus styles
          aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
          initial={{ opacity: 0, scale: 0.8, rotate: -90 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          exit={{ opacity: 0, scale: 0.8, rotate: 90 }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
        >
          {theme === "dark" ? (
            <SunIcon className="h-5 w-5 text-yellow-400" />
          ) : (
            <MoonIcon className="h-5 w-5 text-indigo-500" />
          )}
        </motion.button>
      </AnimatePresence>
    </div>
  )
}
// src/components/main-nav.tsx
"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ThemeSwitcher } from "@/components/theme-switcher" // Correct path
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet" // Added SheetClose
import { MenuIcon } from "lucide-react" // Removed XIcon as Sheet handles close
import { Button } from "@/components/ui/button"

const navItems = [
  { href: "#about", label: "About" },
  { href: "#skills", label: "Skills" },
  { href: "#projects", label: "Projects" },
  { href: "#offerings", label: "Offerings" },
  // { href: "#resume", label: "Resume" }, // Often handled separately (e.g., in About or Footer)
  { href: "#contact", label: "Contact" },
]

export function MainNav() {
  const [activeSection, setActiveSection] = useState<string>("")
  const [scrolled, setScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // Control sheet state

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 50;
      setScrolled(isScrolled);

      // Improved section tracking - find the section closest to the top of the viewport
      let currentSection = "";
      const sections = document.querySelectorAll("section[id]");
      let minDistance = Infinity;

      sections.forEach((section) => {
          const sectionTop = section.getBoundingClientRect().top;
          const distance = Math.abs(sectionTop);

          // Adjust threshold as needed (e.g., 150px from top)
          if (sectionTop <= 150 && distance < minDistance) {
              minDistance = distance;
              currentSection = `#${section.getAttribute("id") || ""}`;
          }
      });

      // Fallback to top if no section is active near the top
      if (!currentSection && window.scrollY < 200) {
          currentSection = "/"; // Or keep empty if preferred
      }

      setActiveSection(currentSection);
    };


    window.addEventListener("scroll", handleScroll, { passive: true }); // Use passive listener
    handleScroll(); // Initial check

    return () => window.removeEventListener("scroll", handleScroll);
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out ${
        scrolled
          ? "py-3 bg-white/90 dark:bg-zinc-950/90 backdrop-blur-lg border-b border-zinc-200 dark:border-zinc-800 shadow-sm"
          : "py-5 bg-transparent border-b border-transparent" // Transparent background initially
      }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8"> {/* Standard padding */}
        <Link href="/" aria-label="Homepage"> {/* Added aria-label */}
          <motion.div
            className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600 dark:from-purple-500 dark:via-violet-500 dark:to-indigo-500"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <span className="font-mono">Paluga</span>Portfolio
          </motion.div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`relative px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                 activeSection === item.href
                   ? 'text-zinc-900 dark:text-zinc-50' // Active style
                   : 'text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50' // Default + Hover
              }`}
              aria-current={activeSection === item.href ? "page" : undefined}
            >
              {item.label}
              {activeSection === item.href && (
                <motion.div
                  className="absolute bottom-0 left-1 right-1 h-0.5 bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-purple-500 dark:to-indigo-500 rounded-full" // Adjusted position/rounding
                  layoutId="activeSectionIndicator" // Unique layoutId
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }} // Smoother transition
                />
              )}
            </Link>
          ))}
          <div className="ml-4"> {/* Increased spacing */}
            <ThemeSwitcher />
          </div>
        </nav>

        {/* Mobile Navigation */}
        <div className="md:hidden flex items-center">
          <ThemeSwitcher />
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="ml-2" aria-label="Open navigation menu"> {/* Added aria-label */}
                <MenuIcon className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[280px] sm:w-[320px] bg-white dark:bg-zinc-950 p-6"> {/* Adjusted width and padding */}
              <div className="flex flex-col h-full">
                 <div className="flex items-center justify-between mb-8 pb-4 border-b dark:border-zinc-800"> {/* Added border */}
                  <Link href="/" onClick={() => setIsMobileMenuOpen(false)}> {/* Close on link click */}
                    <div className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600 dark:from-purple-500 dark:via-violet-500 dark:to-indigo-500">
                      <span className="font-mono">dev</span>Portfolio
                    </div>
                  </Link>
                   {/* Close button is built into SheetContent */}
                </div>

                <nav className="flex flex-col gap-2 flex-grow"> {/* Added flex-grow */}
                  <AnimatePresence>
                    {navItems.map((item, index) => (
                      <motion.div
                        key={item.href}
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -50 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        className="w-full"
                      >
                        {/* Use SheetClose to automatically close the sheet on link click */}
                        <SheetClose asChild>
                          <Link
                            href={item.href}
                            className={`flex w-full items-center py-3 px-4 rounded-md text-base font-medium transition-colors ${ // Adjusted padding/text size
                              activeSection === item.href
                                ? "bg-zinc-100 dark:bg-zinc-800 text-purple-600 dark:text-purple-400" // Highlight active link
                                : "text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                            }`}
                            aria-current={activeSection === item.href ? "page" : undefined}
                          >
                            {item.label}
                          </Link>
                        </SheetClose>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </nav>
                 {/* Optional: Add social links or other elements at the bottom */}
                 <div className="mt-auto pt-6 border-t dark:border-zinc-800 text-center text-xs text-zinc-500">
                    © {new Date().getFullYear()} Willard James Paluga
                 </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
// src/components/footer.tsx
"use client"

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowUpIcon, GithubIcon, LinkedinIcon, MailIcon } from 'lucide-react'
import { ThemeSwitcher } from '@/components/theme-switcher' // Correct path

export function Footer() {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  const currentYear = new Date().getFullYear()

  // Placeholder links - replace with actual URLs
  const githubUrl = "https://github.com/wilardzysenpai";
  const linkedinUrl = "https://linkedin.com/in/hachiki3819";
  const emailAddress = "mailto:paluga.willardjames.arlan@gmail.com";
  const telNumber = "tel:+639122117178"; // Optional

  return (
    <footer className="relative border-t border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900 py-16"> {/* Adjusted background slightly */}
      <div className="absolute top-0 inset-x-0 flex justify-center -translate-y-1/2"> {/* Simplified centering */}
          <motion.button
            onClick={scrollToTop}
            aria-label="Scroll to top" // Added aria-label
            className="flex items-center justify-center h-10 w-10 rounded-full bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors shadow-md" // Adjusted styling
            whileHover={{ y: -5, scale: 1.1 }} // Enhanced hover effect
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <ArrowUpIcon className="h-5 w-5 text-zinc-700 dark:text-zinc-300" />
          </motion.button>
      </div>

      <div className="container max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 md:gap-8"> {/* Adjusted gap */}
          {/* Column 1: Branding & Social */}
          <div className="md:col-span-1 flex flex-col"> {/* Flex column for alignment */}
            <Link href="/" aria-label="Homepage"> {/* Added aria-label */}
              <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600 dark:from-purple-500 dark:via-violet-500 dark:to-indigo-500 inline-block"> {/* Inline-block for text gradient */}
                <span className="font-mono">Paluga</span>Portfolio
              </h2>
            </Link>
            <p className="mt-4 text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed flex-grow"> {/* Adjusted text size/leading */}
              Full-stack developer specializing in building exceptional digital experiences. Crafting scalable solutions with modern technology.
            </p>
            <div className="mt-6 flex space-x-4">
              <a
                href={githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-zinc-500 hover:text-purple-600 dark:text-zinc-400 dark:hover:text-purple-400 transition-colors"
                aria-label="GitHub Profile"
              >
                <GithubIcon className="h-5 w-5" />
              </a>
              <a
                href={linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-zinc-500 hover:text-purple-600 dark:text-zinc-400 dark:hover:text-purple-400 transition-colors"
                aria-label="LinkedIn Profile"
              >
                <LinkedinIcon className="h-5 w-5" />
              </a>
              <a
                href={emailAddress}
                className="text-zinc-500 hover:text-purple-600 dark:text-zinc-400 dark:hover:text-purple-400 transition-colors"
                aria-label="Send Email"
              >
                <MailIcon className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Column 2: Navigation */}
          <div>
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 mb-4 uppercase tracking-wider">Navigation</h3> {/* Adjusted styling */}
            <ul className="space-y-3"> {/* Increased spacing */}
              {['Home', 'About', 'Skills', 'Projects', 'Offerings', 'Contact'].map((item) => (
                <li key={item}>
                  <Link
                    href={item === 'Home' ? '/' : `#${item.toLowerCase()}`} // Link to root for Home
                    className="text-zinc-600 dark:text-zinc-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors text-sm"
                  >
                    {item}
                  </Link>
                </li>
              ))}
               <li> {/* Added Resume link here */}
                 <a href="/resume.pdf" download className="text-zinc-600 dark:text-zinc-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors text-sm">
                   Resume
                 </a>
               </li>
            </ul>
          </div>

          {/* Column 3: Services */}
          <div>
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 mb-4 uppercase tracking-wider">Services</h3> {/* Adjusted styling */}
            <ul className="space-y-3"> {/* Increased spacing */}
              {['Full-Stack Development', 'API Development', 'Performance Optimization', 'DevOps Automation'].map((item) => (
                <li key={item}>
                  <Link
                    href="#offerings"
                    className="text-zinc-600 dark:text-zinc-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors text-sm"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Contact & Theme */}
          <div>
             <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 mb-4 uppercase tracking-wider">Contact</h3> {/* Adjusted styling */}
            <address className="not-italic text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed">
              <p>San Francisco, California</p> {/* Keep location generic or make editable */}
              <p className="mt-2">
                <a
                  href={emailAddress}
                  className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors break-all" // Allow email break
                >
                  paluga.willardjames.arlan@gmail.com
                </a>
              </p>
              {/* Optional phone number */}
              {/* <p className="mt-1">
                <a
                  href={telNumber}
                  className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                >
                  +1 (234) 567-890
                </a>
              </p> */}
            </address>

            <div className="mt-6 flex items-center">
              <ThemeSwitcher />
              <span className="ml-2 text-xs text-zinc-600 dark:text-zinc-400">Toggle Theme</span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-zinc-200 dark:border-zinc-700 flex flex-col sm:flex-row justify-between items-center"> {/* Adjusted padding/border */}
          <p className="text-zinc-500 dark:text-zinc-400 text-xs"> {/* Smaller text */}
            © {currentYear} Willard James Paluga. All rights reserved.
          </p>
          <div className="mt-4 sm:mt-0">
            <nav className="flex space-x-4 text-xs"> {/* Smaller text */}
              <Link
                href="/privacy-policy" // Use actual links
                className="text-zinc-500 dark:text-zinc-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms-of-service" // Use actual links
                className="text-zinc-500 dark:text-zinc-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
              >
                Terms of Service
              </Link>
            </nav>
          </div>
        </div>
      </div>
    </footer>
  )
}
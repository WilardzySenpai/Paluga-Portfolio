"use client"

import { useEffect, useRef } from 'react'
import { motion, useInView, useAnimation } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { ArrowDownIcon, GithubIcon, LinkedinIcon, MailIcon } from 'lucide-react'
import Link from 'next/link'

export function HeroSection() {
  const controls = useAnimation()
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })

  useEffect(() => {
    if (inView) {
      controls.start('visible')
    }
  }, [controls, inView])

  // Animation variants
  const headingVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  }

  const textVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delay: 0.3,
        duration: 0.6,
      },
    },
  }

  const buttonVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.6,
        duration: 0.4,
      },
    },
  }

  const iconVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: (custom: number) => ({
      opacity: 1,
      scale: 1,
      transition: {
        delay: 0.8 + custom * 0.1,
        duration: 0.4,
        type: "spring",
        stiffness: 200,
      },
    }),
  }

  const backgroundVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delay: 0.1,
        duration: 0.6,
      },
    },
  }

  return (
    <section className="relative min-h-screen flex flex-col justify-center overflow-hidden py-16 lg:py-24">
      {/* Abstract background */}
      <motion.div
        className="absolute inset-0 -z-10 opacity-20 dark:opacity-10 pointer-events-none"
        initial="hidden"
        animate="visible"
        variants={backgroundVariants}
      >
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-purple-400 to-indigo-600 rounded-full filter blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gradient-to-tr from-pink-400 to-purple-600 rounded-full filter blur-3xl" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-blue-400 to-teal-500 rounded-full filter blur-3xl opacity-20" />
      </motion.div>

      <div className="container max-w-7xl mx-auto px-6 lg:px-8">
        <div ref={ref} className="max-w-3xl mx-auto text-center">
          <motion.h1
            className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600 dark:from-purple-500 dark:via-violet-500 dark:to-indigo-500"
            initial="hidden"
            animate={controls}
            variants={headingVariants}
          >
            Full-Stack Architect Building Scalable Solutions
          </motion.h1>

          <motion.p
            className="mt-6 text-lg lg:text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto"
            initial="hidden"
            animate={controls}
            variants={textVariants}
          >
            I craft modern, high-performance web applications with cutting-edge technologies.
            Specialized in React, Next.js, and Node.js ecosystems to deliver exceptional user experiences.
          </motion.p>

          <motion.div
            className="mt-10 flex flex-col sm:flex-row gap-4 justify-center"
            initial="hidden"
            animate={controls}
            variants={buttonVariants}
          >
            <Button asChild size="lg" className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white border-0">
              <Link href="#projects">
                View Projects <ArrowDownIcon className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="#contact">
                Get in Touch
              </Link>
            </Button>
          </motion.div>

          <motion.div
            className="mt-12 flex justify-center gap-6"
            initial="hidden"
            animate={controls}
          >
            <motion.a
              href="https://github.com/username"
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors"
              custom={0}
              variants={iconVariants}
            >
              <GithubIcon className="h-6 w-6" />
              <span className="sr-only">GitHub</span>
            </motion.a>
            <motion.a
              href="https://linkedin.com/in/username"
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors"
              custom={1}
              variants={iconVariants}
            >
              <LinkedinIcon className="h-6 w-6" />
              <span className="sr-only">LinkedIn</span>
            </motion.a>
            <motion.a
              href="mailto:paluga.willardjames.arlan@gmail.com"
              className="text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors"
              custom={2}
              variants={iconVariants}
            >
              <MailIcon className="h-6 w-6" />
              <span className="sr-only">Email</span>
            </motion.a>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          delay: 1.2,
          duration: 0.6,
          repeat: Infinity,
          repeatType: "reverse",
        }}
      >
        <ArrowDownIcon className="h-6 w-6 text-zinc-400" />
      </motion.div>
    </section>
  )
}

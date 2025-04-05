// src/components/sections/about-section.tsx
"use client"

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { DownloadIcon } from 'lucide-react'

export function AboutSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  }

  return (
    <section id="about" className="py-24 bg-zinc-50/50 dark:bg-zinc-900/20">
      <div className="container max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          ref={ref}
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          <div className="lg:order-2">
            <div className="relative aspect-square max-w-md mx-auto lg:mx-0">
              <div className="absolute -left-4 -top-4 w-full h-full border-2 border-indigo-500 rounded-lg" />
              <div className="absolute -right-4 -bottom-4 w-full h-full border-2 border-purple-500 rounded-lg" />
              <div className="relative w-full h-full overflow-hidden rounded-lg">
                <Image
                  src="/paluga.png"
                  alt="Developer Profile"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-xl">10+</span>
              </div>
            </div>
          </div>

          <div>
            <motion.div variants={itemVariants}>
              <h2 className="text-3xl md:text-4xl font-bold">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600 dark:from-purple-500 dark:via-violet-500 dark:to-indigo-500">
                  About Me
                </span>
              </h2>
              <div className="w-20 h-1 bg-gradient-to-r from-purple-600 to-indigo-600 mt-2" />
            </motion.div>

            <motion.p variants={itemVariants} className="mt-6 text-lg text-zinc-700 dark:text-zinc-300">
              I'm a passionate full-stack developer with a focus on creating modern, high-performance web applications that deliver exceptional user experiences.
            </motion.p>

            <motion.p variants={itemVariants} className="mt-4 text-zinc-600 dark:text-zinc-400">
            With 6 years of experience in the coding industry, I've developed expertise in a variety of technologies and frameworks to create scalable, user-focused solutions. I strive to blend technical proficiency with a strong understanding of user needs and business goals, ensuring impactful results across diverse projects.
            </motion.p>

            <motion.div variants={itemVariants} className="mt-8 grid grid-cols-2 gap-4">
              <div className="border border-zinc-200 dark:border-zinc-800 rounded-lg p-4 bg-white/50 dark:bg-zinc-800/50">
                <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">Frontend</h3>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">Crafting responsive, accessible interfaces with React, Next.js, and Tailwind CSS.</p>
              </div>

              <div className="border border-zinc-200 dark:border-zinc-800 rounded-lg p-4 bg-white/50 dark:bg-zinc-800/50">
                <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">Backend</h3>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">Building robust APIs and services using Node.js, Express, and various databases.</p>
              </div>

              <div className="border border-zinc-200 dark:border-zinc-800 rounded-lg p-4 bg-white/50 dark:bg-zinc-800/50">
                <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">DevOps</h3>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">Implementing CI/CD pipelines and cloud infrastructure for seamless deployment.</p>
              </div>

              <div className="border border-zinc-200 dark:border-zinc-800 rounded-lg p-4 bg-white/50 dark:bg-zinc-800/50">
                <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">Architecture</h3>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">Designing scalable system architectures that prioritize performance and security.</p>
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="mt-8">
              <Button asChild variant="outline" size="lg" className="group">
                <a href="/resume.pdf" download>
                  Download Resume <DownloadIcon className="ml-2 h-4 w-4 group-hover:animate-bounce" />
                </a>
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

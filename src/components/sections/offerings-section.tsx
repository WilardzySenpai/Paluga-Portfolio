"use client"

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { offeringsData, getFeaturedOfferings } from '@/lib/offerings-data'
import { Button } from '@/components/ui/button'
import { CheckIcon } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

export function OfferingsSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
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

  const featuredOfferings = getFeaturedOfferings()

  return (
    <section id="offerings" className="py-24">
      <div className="container max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          <motion.div variants={itemVariants} className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600 dark:from-purple-500 dark:via-violet-500 dark:to-indigo-500">
                Professional Services
              </span>
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-purple-600 to-indigo-600 mt-2 mx-auto" />
            <p className="mt-6 text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
              Specialized expertise in web development, helping businesses build robust, scalable applications with modern technologies.
            </p>
          </motion.div>

          <motion.div variants={itemVariants}>
            {/* Horizontal layout with emphasized first offering */}
            <div className="flex flex-col lg:flex-row gap-8">
              {/* First featured offering (emphasized) */}
              <div className="lg:w-1/2 bg-gradient-to-br from-purple-500/10 to-indigo-500/10 rounded-2xl p-8 border border-purple-200 dark:border-purple-950 relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-indigo-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="relative z-10">
                  <div className="flex items-center mb-6">
                    <div className="bg-gradient-to-br from-purple-600 to-indigo-600 p-3 rounded-xl mr-4">
                      {React.createElement(featuredOfferings[0].icon, { className: "h-7 w-7 text-white" })}
                    </div>
                    <h3 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">{featuredOfferings[0].title}</h3>
                  </div>

                  <p className="text-zinc-600 dark:text-zinc-400 mb-8 text-lg">
                    {featuredOfferings[0].description}
                  </p>

                  <h4 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-4">Key Benefits:</h4>
                  <ul className="space-y-3 mb-8">
                    {featuredOfferings[0].benefits.map((benefit) => (
                      <li key={benefit} className="flex items-start">
                        <CheckIcon className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-zinc-700 dark:text-zinc-300">{benefit}</span>
                      </li>
                    ))}
                  </ul>

                  <Button asChild>
                    <Link href="#contact">
                      Request {featuredOfferings[0].title}
                    </Link>
                  </Button>
                </div>
              </div>

              {/* Other featured offerings (grid) */}
              <div className="lg:w-1/2 grid grid-cols-1 md:grid-cols-2 gap-6">
                {featuredOfferings.slice(1).map((offering) => (
                  <div
                    key={offering.id}
                    className="bg-white dark:bg-zinc-800 rounded-xl p-6 border border-zinc-200 dark:border-zinc-700 shadow-sm hover:shadow-md transition-shadow group"
                  >
                    <div className="flex items-center mb-4">
                      <div className="bg-gradient-to-br from-purple-500/10 to-indigo-500/10 p-2 rounded-lg mr-3 group-hover:bg-gradient-to-br group-hover:from-purple-600/20 group-hover:to-indigo-600/20 transition-colors">
                        {React.createElement(offering.icon, { className: "h-5 w-5 text-purple-600 dark:text-purple-400" })}
                      </div>
                      <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">{offering.title}</h3>
                    </div>

                    <p className="text-zinc-600 dark:text-zinc-400 mb-4">
                      {offering.description}
                    </p>

                    <div className="mt-4">
                      <Button variant="outline" asChild className="w-full justify-center">
                        <Link href="#contact">
                          Learn More
                        </Link>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="mt-16 text-center">
            <p className="text-zinc-600 dark:text-zinc-400 mb-6">
              Looking for a specific service not listed here? I offer custom solutions tailored to your needs.
            </p>
            <Button asChild size="lg" variant="outline">
              <Link href="#contact">
                Discuss Your Project
              </Link>
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

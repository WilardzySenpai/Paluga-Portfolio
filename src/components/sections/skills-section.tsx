// src/components/sections/skills-section.tsx
"use client"

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { skillsData, skillsByCategory, type Skill } from '@/lib/skills-data'
// import { SkillsInteractiveGrid } from '@/components/skills-grid-visualization'
// import { SkillsBubbleChart } from '@/components/skills-chart-visualization'
import { SkillsRadarChart } from '@/components/skill-radar-chart-visualization'
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card'
import { Button } from '@/components/ui/button'

export function SkillsSection() {
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

    // Sort categories alphabetically for consistent rendering order
    const sortedCategories = Object.entries(skillsByCategory).sort(
        ([categoryA], [categoryB]) => categoryA.localeCompare(categoryB)
    );

    return (
        <section id="skills" className="py-24">
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
                                Technical Skills
                            </span>
                        </h2>
                        <div className="w-20 h-1 bg-gradient-to-r from-purple-600 to-indigo-600 mt-2 mx-auto" />
                        <p className="mt-6 text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
                            Explore my technical expertise across various domains. Click on categories to see detailed skills.
                        </p>
                    </motion.div>

                    <motion.div variants={itemVariants} className="mb-10">
                        {/* === Use your chosen visualization here === */}
                        {/* <SkillsBubbleChart /> */}
                        {/* <SkillsInteractiveGrid /> */}
                        <SkillsRadarChart />
                    </motion.div>

                    {/* Optional skill breakdown section */}
                    <motion.div variants={itemVariants} className="mt-12">
                        <h3 className="text-2xl font-bold text-center mb-8">Skills At a Glance</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {/* MAP OVER THE SORTED CATEGORIES */}
                            {sortedCategories.map(([category, skills]) => (
                                <div key={category} className="bg-white/50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-800 rounded-lg p-6">
                                    <h3 className="text-xl font-bold capitalize mb-4 text-zinc-900 dark:text-zinc-50">
                                        {category}
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                        {/* SORT SKILLS WITHIN CATEGORY (alphabetical) */}
                                        {skills
                                            .sort((a: Skill, b: Skill) => a.name.localeCompare(b.name))
                                            .map((skill) => (
                                                <HoverCard key={skill.name}>
                                                    <HoverCardTrigger asChild>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            className="bg-white/80 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 hover:bg-white dark:hover:bg-zinc-800"
                                                        >
                                                            {skill.name}
                                                        </Button>
                                                    </HoverCardTrigger>
                                                    <HoverCardContent className="w-80">
                                                        <div className="flex justify-between">
                                                            <h4 className="text-lg font-semibold">{skill.name}</h4>
                                                            <div className="flex items-center">
                                                                <div className="w-12 h-2 bg-zinc-200 dark:bg-zinc-700 rounded-full overflow-hidden">
                                                                    <div
                                                                        className="h-full bg-gradient-to-r from-purple-500 to-indigo-600"
                                                                        style={{ width: `${skill.level * 10}%` }}
                                                                    />
                                                                </div>
                                                                <span className="ml-2 text-sm text-zinc-600 dark:text-zinc-400">{skill.level}/10</span>
                                                            </div>
                                                        </div>
                                                        <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-2">
                                                            {skill.description || `Experienced in ${skill.name} development and implementation.`}
                                                        </p>
                                                    </HoverCardContent>
                                                </HoverCard>
                                            ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    )
}
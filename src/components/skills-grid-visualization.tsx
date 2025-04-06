// src/components/skills-grid-visualization.tsx
"use client"

import React, { useState, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { skillsData, skillsByCategory, type Skill } from '@/lib/skills-data'
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card'
import { Button } from '@/components/ui/button'

export function SkillsGridVisualization() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.4,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  const handleCategoryClick = (category: string) => {
    setActiveCategory(activeCategory === category ? null : category);
  };

  const categories = Object.keys(skillsByCategory);

  // Calculate skill level for visual representation
  const getSkillSize = (level: number) => {
    // Calculate size between 1-4 based on level 1-10
    return Math.max(1, Math.min(4, Math.floor(level / 2.5) + 1));
  };

  return (
    <div>
      {/* Category Filter */}
      <motion.div 
        ref={ref}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        variants={containerVariants}
        className="mb-8 flex flex-wrap justify-center gap-2"
      >
        {categories.map((category) => (
          <motion.div key={category} variants={itemVariants}>
            <Button
              variant={activeCategory === category ? "default" : "outline"}
              onClick={() => handleCategoryClick(category)}
              className="capitalize"
            >
              {category}
            </Button>
          </motion.div>
        ))}
        {activeCategory && (
          <motion.div variants={itemVariants}>
            <Button
              variant="ghost"
              onClick={() => setActiveCategory(null)}
              className="text-zinc-500 dark:text-zinc-400"
            >
              Clear filter
            </Button>
          </motion.div>
        )}
      </motion.div>

      {/* Skills Visualization */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6"
      >
        {skillsData
          .filter(skill => !activeCategory || skill.category === activeCategory)
          .sort((a, b) => b.level - a.level)
          .map((skill) => (
            <SkillItem key={skill.name} skill={skill} itemVariants={itemVariants} />
          ))}
      </motion.div>
    </div>
  );
}

interface SkillItemProps {
  skill: Skill;
  itemVariants: any;
}

function SkillItem({ skill, itemVariants }: SkillItemProps) {
  // Calculate size based on skill level (1-4)
  const sizeClass = {
    1: "h-16 w-16",
    2: "h-20 w-20",
    3: "h-24 w-24",
    4: "h-28 w-28",
  }[Math.max(1, Math.min(4, Math.floor(skill.level / 2.5) + 1))];

  // Make background color based on skill color or fallback
  const bgColorStyle = {
    backgroundColor: skill.color || "#8B5CF6",
    color: skill.color && skill.color.toLowerCase() === "#ffffff" ? "#000000" : "#FFFFFF",
  };

  return (
    <motion.div variants={itemVariants} className="flex justify-center">
      <HoverCard>
        <HoverCardTrigger>
          <motion.div
            className={`${sizeClass} rounded-full flex items-center justify-center text-white font-medium shadow-lg cursor-pointer`}
            style={bgColorStyle}
            whileHover={{ 
              scale: 1.1, 
              boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.2)" 
            }}
            transition={{ 
              type: "spring", 
              stiffness: 400, 
              damping: 15 
            }}
          >
            <div className="text-center p-1">
              <div className="text-xs md:text-sm font-bold truncate max-w-full px-2">
                {skill.name}
              </div>
              <div className="text-xs opacity-80">{skill.level}/10</div>
            </div>
          </motion.div>
        </HoverCardTrigger>
        <HoverCardContent className="w-80">
          <div className="flex justify-between items-center">
            <h4 className="text-lg font-semibold">{skill.name}</h4>
            <div className="flex items-center">
              <div className="w-24 h-2 bg-zinc-200 dark:bg-zinc-700 rounded-full overflow-hidden">
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
          <div className="mt-2 text-xs text-zinc-500 dark:text-zinc-500 inline-block px-2 py-1 bg-zinc-100 dark:bg-zinc-800 rounded-full">
            {skill.category}
          </div>
        </HoverCardContent>
      </HoverCard>
    </motion.div>
  );
}

// Alternative version that shows skills as an expanding/interactive grid
export function SkillsInteractiveGrid() {
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.4,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  const categoryColors = {
    frontend: "from-blue-500 to-cyan-400",
    backend: "from-green-500 to-emerald-400",
    devops: "from-orange-500 to-amber-400",
    other: "from-violet-500 to-purple-400",
  };

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={containerVariants}
      className="space-y-6"
    >
      {Object.entries(skillsByCategory).map(([category, skills]) => (
        <motion.div
          key={category}
          variants={itemVariants}
          className="bg-white/50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-800 rounded-lg overflow-hidden transition-all duration-300"
        >
          <div
            className={`bg-gradient-to-r ${categoryColors[category as keyof typeof categoryColors]} p-4 cursor-pointer`}
            onClick={() => setExpandedCategory(expandedCategory === category ? null : category)}
          >
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold capitalize text-white">
                {category}
              </h3>
              <div className="bg-white/20 rounded-full px-3 py-1 text-sm text-white">
                {skills.length} skills
              </div>
            </div>
          </div>
          
          <motion.div
            initial={false}
            animate={{
              height: expandedCategory === category ? 'auto' : 0,
              opacity: expandedCategory === category ? 1 : 0,
            }}
            className="overflow-hidden"
          >
            <div className="p-4">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {skills.sort((a, b) => b.level - a.level).map((skill) => (
                  <HoverCard key={skill.name}>
                    <HoverCardTrigger asChild>
                      <motion.div
                        whileHover={{ y: -4 }}
                        className="p-3 bg-white dark:bg-zinc-800 rounded-md border border-zinc-200 dark:border-zinc-700 cursor-pointer"
                      >
                        <div className="flex items-center justify-between">
                          <div className="font-medium truncate">{skill.name}</div>
                          <div className="text-xs bg-zinc-100 dark:bg-zinc-900 px-2 py-0.5 rounded-full ml-1">
                            {skill.level}/10
                          </div>
                        </div>
                        <div className="mt-2 w-full h-1.5 bg-zinc-100 dark:bg-zinc-700 rounded-full overflow-hidden">
                          <div
                            className={`h-full bg-gradient-to-r ${categoryColors[category as keyof typeof categoryColors]}`}
                            style={{ width: `${skill.level * 10}%` }}
                          />
                        </div>
                      </motion.div>
                    </HoverCardTrigger>
                    <HoverCardContent className="w-80">
                      <div className="flex justify-between">
                        <h4 className="text-lg font-semibold">{skill.name}</h4>
                        <div className="flex items-center">
                          <div className="w-16 h-2 bg-zinc-200 dark:bg-zinc-700 rounded-full overflow-hidden">
                            <div
                              className={`h-full bg-gradient-to-r ${categoryColors[category as keyof typeof categoryColors]}`}
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
          </motion.div>
        </motion.div>
      ))}
    </motion.div>
  );
}
import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { skillsData, skillsByCategory, Skill } from '@/lib/skills-data';

// Define the category type explicitly based on skillsByCategory keys
type SkillCategory = keyof typeof skillsByCategory;

// Define the color theme type
type CategoryColorTheme = {
  primary: string;
  secondary: string;
  text: string;
};

export function SkillsRadarChart() {
    const [inViewRef, isInView] = useInView({ 
        triggerOnce: true,
        threshold: 0.1
    });

    // Category colors for visual styling
    const categoryColors: Record<SkillCategory, CategoryColorTheme> = {
        "frontend": { primary: "#3b82f6", secondary: "#2563eb", text: "#bfdbfe" },
        "backend": { primary: "#10b981", secondary: "#059669", text: "#a7f3d0" },
        "devops": { primary: "#f59e0b", secondary: "#d97706", text: "#fcd34d" },
        "other": { primary: "#8b5cf6", secondary: "#7c3aed", text: "#c4b5fd" }
    };

    // Get all categories and prepare categorized skills for display
    const categorizedAndSortedSkills: Record<SkillCategory, Skill[]> = {} as Record<SkillCategory, Skill[]>;
    
    // Use type assertion to tell TypeScript that category is a valid key
    Object.keys(skillsByCategory).forEach(categoryKey => {
        const category = categoryKey as SkillCategory;
        categorizedAndSortedSkills[category] = skillsByCategory[category]
            .sort((a, b) => b.level - a.level)
            .slice(0, 5); // Take top 5 skills for each category to avoid clutter
    });

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.03,
                delayChildren: 0.2
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.5, ease: "easeOut" }
        }
    };

    // Chart dimensions
    const svgWidth = 800;
    const svgHeight = 500;
    const margin = { top: 80, right: 40, bottom: 80, left: 40 };
    const width = svgWidth - margin.left - margin.right;
    const height = svgHeight - margin.top - margin.bottom;

    // Get all categories
    const categories = Object.keys(categorizedAndSortedSkills) as SkillCategory[];
    const categoryWidth = width / categories.length;

    return (
        <div ref={inViewRef} className="w-full overflow-hidden bg-zinc-900 rounded-xl p-4 md:p-6">
            <h3 className="text-2xl font-bold text-white text-center mb-6">Skill Proficiency</h3>
            
            <motion.svg
                width="100%"
                height="100%"
                viewBox={`0 0 ${svgWidth} ${svgHeight}`}
                preserveAspectRatio="xMidYMid meet"
                variants={containerVariants}
                initial="hidden"
                animate={isInView ? "visible" : "hidden"}
                className="mx-auto"
            >
                {/* Background gradients */}
                <defs>
                    {categories.map((category, i) => {
                        const colors = categoryColors[category];
                        return (
                            <linearGradient 
                                key={`bg-gradient-${category}`} 
                                id={`bg-gradient-${category}`} 
                                x1="0%" 
                                y1="0%" 
                                x2="0%" 
                                y2="100%"
                            >
                                <stop offset="0%" stopColor={colors.primary} stopOpacity="0.1" />
                                <stop offset="100%" stopColor={colors.primary} stopOpacity="0.02" />
                            </linearGradient>
                        );
                    })}
                </defs>

                {/* Category backgrounds */}
                {categories.map((category, i) => {
                    const x = margin.left + (i * categoryWidth);
                    return (
                        <motion.rect
                            key={`category-bg-${category}`}
                            x={x}
                            y={margin.top}
                            width={categoryWidth}
                            height={height}
                            fill={`url(#bg-gradient-${category})`}
                            variants={itemVariants}
                        />
                    );
                })}

                {/* Grid lines */}
                {[2, 4, 6, 8, 10].map((level) => (
                    <motion.g key={`grid-${level}`} variants={itemVariants}>
                        <line
                            x1={margin.left}
                            y1={margin.top + height - (height * level / 10)}
                            x2={margin.left + width}
                            y2={margin.top + height - (height * level / 10)}
                            stroke="#27272a"
                            strokeWidth="1"
                        />
                        <text
                            x={margin.left - 10}
                            y={margin.top + height - (height * level / 10) + 5}
                            fontSize="12"
                            textAnchor="end"
                            fill="#71717a"
                        >
                            {level}
                        </text>
                    </motion.g>
                ))}

                {/* Baseline */}
                <line
                    x1={margin.left}
                    y1={margin.top + height}
                    x2={margin.left + width}
                    y2={margin.top + height}
                    stroke="#3f3f46"
                    strokeWidth="1"
                />

                {/* Category headers */}
                {categories.map((category, i) => {
                    const colors = categoryColors[category];
                    const x = margin.left + (i * categoryWidth) + (categoryWidth / 2);
                    
                    return (
                        <motion.g key={`header-${category}`} variants={itemVariants}>
                            <text
                                x={x}
                                y={margin.top - 30}
                                fontSize="16"
                                fontWeight="bold"
                                textAnchor="middle"
                                fill={colors.primary}
                                style={{ textTransform: 'capitalize' }}
                            >
                                {category}
                            </text>
                        </motion.g>
                    );
                })}

                {/* Skills Bars */}
                {categories.map((category, categoryIndex) => {
                    const skills = categorizedAndSortedSkills[category];
                    const colors = categoryColors[category];
                    const categoryX = margin.left + (categoryIndex * categoryWidth);
                    const barWidth = Math.min(30, (categoryWidth / skills.length) - 10);
                    
                    return skills.map((skill, skillIndex) => {
                        const x = categoryX + ((skillIndex + 0.5) * (categoryWidth / skills.length)) - (barWidth / 2);
                        const barHeight = (height * skill.level / 10);
                        const y = margin.top + height - barHeight;

                        return (
                            <motion.g
                                key={`skill-${skill.name}-${categoryIndex}`}
                                variants={itemVariants}
                                whileHover={{ scale: 1.05 }}
                                custom={skillIndex}
                            >
                                <HoverCard>
                                    <HoverCardTrigger asChild>
                                        <g style={{ cursor: 'pointer' }}>
                                            {/* Bar glow effect */}
                                            <defs>
                                                <filter id={`glow-${skill.name}`} x="-50%" y="-50%" width="200%" height="200%">
                                                    <feGaussianBlur stdDeviation="3" result="blur" />
                                                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                                                </filter>
                                                
                                                <linearGradient id={`gradient-${skill.name}`} x1="0%" y1="0%" x2="0%" y2="100%">
                                                    <stop offset="0%" stopColor={colors.primary} />
                                                    <stop offset="100%" stopColor={colors.secondary} />
                                                </linearGradient>
                                            </defs>
                                            
                                            {/* Bar shadow */}
                                            <rect
                                                x={x}
                                                y={y + 2}
                                                width={barWidth}
                                                height={barHeight}
                                                rx={4}
                                                fill="rgba(0,0,0,0.3)"
                                                filter={`url(#glow-${skill.name})`}
                                            />
                                            
                                            {/* Actual bar with custom skill color accent */}
                                            <rect
                                                x={x}
                                                y={y}
                                                width={barWidth}
                                                height={barHeight}
                                                rx={4}
                                                fill={`url(#gradient-${skill.name})`}
                                            />
                                            
                                            {/* Skill level indicator with skill's color */}
                                            <circle
                                                cx={x + barWidth / 2}
                                                cy={y}
                                                r={4}
                                                fill={skill.color || "white"}
                                            />
                                            
                                            {/* Skill name */}
                                            <text
                                                x={x + barWidth / 2}
                                                y={margin.top + height + 30}
                                                fontSize="12"
                                                fontWeight="medium"
                                                textAnchor="middle"
                                                transform={`rotate(45, ${x + barWidth / 2}, ${margin.top + height + 15})`}
                                                fill="#d4d4d8"
                                            >
                                                {skill.name}
                                            </text>
                                        </g>
                                    </HoverCardTrigger>
                                    <HoverCardContent className="w-80 bg-zinc-800 border-zinc-700 text-zinc-100">
                                        <div className="flex justify-between">
                                            <h4 className="text-lg font-semibold">{skill.name}</h4>
                                            <div className="flex items-center">
                                                <div className="w-16 h-2 bg-zinc-700 rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full"
                                                        style={{ 
                                                            width: `${skill.level * 10}%`, 
                                                            backgroundColor: skill.color || colors.primary 
                                                        }}
                                                    />
                                                </div>
                                                <span className="ml-2 text-sm">{skill.level}/10</span>
                                            </div>
                                        </div>
                                        <p className="text-sm text-zinc-300 mt-2">
                                            {skill.description || `Experienced in ${skill.name} development and implementation.`}
                                        </p>
                                        <div className="mt-2 text-xs inline-block px-2 py-1 bg-zinc-700 rounded-full" style={{ color: colors.primary }}>
                                            {skill.category}
                                        </div>
                                    </HoverCardContent>
                                </HoverCard>
                            </motion.g>
                        );
                    });
                })}
            </motion.svg>
        </div>
    );
}
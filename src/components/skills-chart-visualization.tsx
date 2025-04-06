// src/components/skills-chart-visualization.tsx
"use client"

import React, { useRef, useMemo } from 'react';
import { useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { skillsData, skillsByCategory, type Skill } from '@/lib/skills-data';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import * as d3 from 'd3-force'; // Import d3-force for better packing

// Define the structure of the nodes used in the D3 simulation
interface SimulationNode extends d3.SimulationNodeDatum {
    id: number;
    skill: Skill; // Your existing Skill type
    radius: number;
    category: keyof typeof categoryColors; // Use the specific keys from categoryColors
}

// Colors for different skill categories
const categoryColors = {
    frontend: {
        primary: "#3B82F6",
        secondary: "#93C5FD",
        text: "#1E3A8A"
    },
    backend: {
        primary: "#10B981",
        secondary: "#A7F3D0",
        text: "#065F46"
    },
    devops: {
        primary: "#F59E0B",
        secondary: "#FCD34D",
        text: "#92400E"
    },
    other: {
        primary: "#8B5CF6",
        secondary: "#C4B5FD",
        text: "#5B21B6"
    }
};

export function SkillsBubbleChart() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });
    const svgRef = useRef<SVGSVGElement>(null);
    const [nodes, setNodes] = useState<SimulationNode[]>([]);
    const [isSimulationComplete, setIsSimulationComplete] = useState(false);

    // Container variants for the parent SVG
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.03, // Controls delay between children starting
                delayChildren: 0.2    // Initial delay before first child starts
            },
        },
    };

    // Update bubbleVariants without explicit delay
    const bubbleVariantsOptimized = {
        hidden: { opacity: 0, scale: 0, originX: 0, originY: 0 },
        visible: {
            opacity: 1,
            scale: 1,
            originX: 0,
            originY: 0,
            transition: { type: "spring", stiffness: 80, damping: 12 } // Base transition
        }
    };

    // Prepare data for simulation
    const simulationData = useMemo((): SimulationNode[] => skillsData.map((skill, index) => ({
        id: index,
        skill,
        radius: 15 + (skill.level * 3.5), // Base size + level multiplier
        category: skill.category as keyof typeof categoryColors, // Keep the assertion here just in case skill.category is broader initially
        // x, y, etc., will be added by D3 simulation
    })), [skillsData]);

    // Run D3 force simulation for positioning
    React.useEffect(() => {
        // Reset completion state if dependencies change (e.g., isInView becomes false)
        setIsSimulationComplete(false);

        if (!svgRef.current || !isInView) {
            // Clear nodes if not in view to ensure simulation reruns correctly
            setNodes([]);
            return;
        };

        // Check if nodes are already calculated for this view instance
        // This prevents re-running if only minor state updates occur
        if (nodes.length === simulationData.length) {
            setIsSimulationComplete(true); // Already done
            return;
        }


        console.log("Starting simulation..."); // Log start

        const width = svgRef.current.clientWidth;
        const height = svgRef.current.clientHeight;

        // Handle potential 0 dimensions if SVG isn't rendered yet
        if (width === 0 || height === 0) {
            console.warn("SVG dimensions are zero, delaying simulation slightly.");
            // Optionally wait a frame or use ResizeObserver, for now just return
            return;
        }

        const centerX = width / 2;
        const centerY = height / 2;

        const simulation = d3.forceSimulation(simulationData)
            .force('charge', d3.forceManyBody().strength(5))
            .force('center', d3.forceCenter(centerX, centerY))
            .force('collision', d3.forceCollide<SimulationNode>().radius(d => d.radius + 2))
            .force('x', d3.forceX(centerX).strength(0.03))
            .force('y', d3.forceY(centerY).strength(0.03))
            .stop();

        simulation.tick(150);
        const finalNodes = simulation.nodes();
        console.log("Simulation finished, setting nodes:", finalNodes);
        setNodes(finalNodes);
        // Set completion state AFTER setting nodes
        setIsSimulationComplete(true);

        // Only run when isInView or simulationData changes
    }, [isInView, simulationData, nodes.length]); // Added nodes.length dependency

    return (
        <div ref={ref} className="w-full" style={{ height: '600px', minHeight: '500px' }}>
            <motion.svg
                ref={svgRef}
                width="100%"
                height="100%"
                viewBox="0 0 800 600"
                preserveAspectRatio="xMidYMid meet"
                variants={containerVariants} // Parent controls stagger
                initial="hidden"
                animate={(isInView && isSimulationComplete) ? "visible" : "hidden"}
                className="mx-auto cursor-default"
            >
                {/* Optional: Connection lines */}
                <g>
                    {/* ... Corrected connection line code ... */}
                    {isSimulationComplete && nodes && nodes.length > 0 && nodes.map((node, i) => {
                        const nodeColors = categoryColors[node.category as keyof typeof categoryColors];
                        if (!nodeColors) return null;
                        const nodeX = typeof node.x === 'number' && !isNaN(node.x) ? node.x : 0;
                        const nodeY = typeof node.y === 'number' && !isNaN(node.y) ? node.y : 0;
                        const sameCategory = nodes.filter(b => b.skill.category === node.skill.category && b.id !== node.id);
                        const nearest = sameCategory.sort((a, b) => {
                            const ax = typeof a.x === 'number' && !isNaN(a.x) ? a.x : 0; const ay = typeof a.y === 'number' && !isNaN(a.y) ? a.y : 0;
                            const bx = typeof b.x === 'number' && !isNaN(b.x) ? b.x : 0; const by = typeof b.y === 'number' && !isNaN(b.y) ? b.y : 0;
                            const distA = Math.sqrt(Math.pow(ax - nodeX, 2) + Math.pow(ay - nodeY, 2)); const distB = Math.sqrt(Math.pow(bx - nodeX, 2) + Math.pow(by - nodeY, 2));
                            return distA - distB;
                        }).slice(0, 2);
                        return nearest.map((target) => {
                            const targetX = typeof target.x === 'number' && !isNaN(target.x) ? target.x : 0; const targetY = typeof target.y === 'number' && !isNaN(target.y) ? target.y : 0;
                            return (<motion.line key={`${node.skill.name}-${target.skill.name}`} x1={nodeX} y1={nodeY} x2={targetX} y2={targetY} stroke={nodeColors.secondary} strokeWidth="1" strokeOpacity="0.25" initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 0.25 }} transition={{ delay: 0.8 + (i * 0.01), duration: 0.8 }} />);
                        });
                    })}
                </g>

                {/* Draw skill bubbles using simulated positions */}
                {isSimulationComplete && nodes.map((node, i) => {
                    const { skill, radius, category } = node;
                    if (!category || !categoryColors[category]) return null;
                    const colors = categoryColors[category];
                    const cx = node.x ?? 400;
                    const cy = node.y ?? 300;
                    if (typeof cx !== 'number' || isNaN(cx) || typeof cy !== 'number' || isNaN(cy)) {
                        return null;
                    }

                    // Check if coordinates are valid numbers, otherwise skip render
                    if (typeof cx !== 'number' || isNaN(cx) || typeof cy !== 'number' || isNaN(cy)) {
                        console.warn(`Invalid coordinates for node ${i}:`, node);
                        return null;
                    }

                    return (
                        <g key={skill.name} transform={`translate(${cx}, ${cy})`}>
                            <motion.g
                                variants={bubbleVariantsOptimized}
                                whileHover={{ zIndex: 10, scale: 1.15, transition: { type: "spring", stiffness: 300, damping: 10 } }}
                            >
                                <HoverCard>
                                    <HoverCardTrigger asChild>
                                        <g style={{ cursor: 'pointer' }}>
                                            <circle
                                                r={radius}
                                                fill={colors.primary}
                                                stroke={colors.secondary}
                                                strokeWidth="2"
                                                style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))' }}
                                            />
                                            <text
                                                textAnchor="middle"
                                                dy=".3em"
                                                fill={colors.text === '#FFFFFF' || colors.primary === '#000000' ? "#FFFFFF" : "#111827"}
                                                fontSize={Math.max(8, radius * 0.35)}
                                                fontWeight="500"
                                                style={{ pointerEvents: 'none', userSelect: 'none' }}
                                            >
                                                {skill.name}
                                            </text>
                                        </g>
                                    </HoverCardTrigger>
                                    <foreignObject x={-150} y={radius + 10} width="320" height="200" style={{ pointerEvents: 'none' }}>
                                        <HoverCardContent className="w-80 pointer-events-auto">
                                            <div className="flex justify-between">
                                                <h4 className="text-lg font-semibold">{skill.name}</h4>
                                                <div className="flex items-center">
                                                    <div className="w-12 h-2 bg-zinc-200 dark:bg-zinc-700 rounded-full overflow-hidden">
                                                        <div className="h-full" style={{ width: `${skill.level * 10}%`, backgroundColor: colors.primary }} />
                                                    </div>
                                                    <span className="ml-2 text-sm text-zinc-600 dark:text-zinc-400">{skill.level}/10</span>
                                                </div>
                                            </div>
                                            <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-2">
                                                {skill.description || `Experienced in ${skill.name} development and implementation.`}
                                            </p>
                                            <div className={`mt-2 text-xs inline-block px-2 py-1 rounded-full`} style={{ backgroundColor: colors.secondary, color: colors.text }}>
                                                {skill.category}
                                            </div>
                                        </HoverCardContent>
                                    </foreignObject>
                                </HoverCard>
                            </motion.g>
                        </g>
                    );
                })}

                {/* Optional: Legend (can also animate if desired) */}
                <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.0 }}> {/* Delay legend slightly */}
                    {/* ... legend code ... */}
                    {Object.entries(categoryColors).map(([category, colors], i) => (
                        <g key={category} transform={`translate(20, ${20 + i * 25})`}>
                            <rect width="12" height="12" fill={colors.primary} rx="2" />
                            <text x="20" y="10" fontSize="12" fill="currentColor" className="text-zinc-600 dark:text-zinc-400 capitalize">
                                {category}
                            </text>
                        </g>
                    ))}
                </motion.g>

            </motion.svg>
        </div>
    );
}
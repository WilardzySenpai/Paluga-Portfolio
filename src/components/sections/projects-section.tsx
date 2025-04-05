"use client"

import { useRef, useState } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { ArrowUpRightIcon, GithubIcon, ExternalLinkIcon, ArrowRightIcon } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { projectsData, type Project, getFeaturedProjects, getAllProjects } from '@/lib/projects-data'

export function ProjectsSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [viewAll, setViewAll] = useState(false)

  const projects = viewAll ? getAllProjects() : getFeaturedProjects()

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

  return (
    <section id="projects" className="py-24 bg-zinc-50/50 dark:bg-zinc-900/20">
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
                Featured Projects
              </span>
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-purple-600 to-indigo-600 mt-2 mx-auto" />
            <p className="mt-6 text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
              A showcase of my recent work, demonstrating my expertise in building full-stack applications.
            </p>
          </motion.div>

          <motion.div variants={itemVariants}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <AnimatePresence>
                {projects.map((project, i) => (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3, delay: i * 0.1 }}
                  >
                    <div
                      className="group relative flex flex-col h-full bg-white dark:bg-zinc-800 rounded-lg overflow-hidden border border-zinc-200 dark:border-zinc-700 shadow-sm hover:shadow-md transition-shadow"
                      onClick={() => setSelectedProject(project)}
                    >
                      <div className="relative h-48 overflow-hidden">
                        <Image
                          src={project.imageSrc}
                          alt={project.title}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                        <div className="absolute bottom-0 w-full p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                          <div className="flex gap-2">
                            {project.githubUrl && (
                              <Button size="icon" variant="outline" className="w-8 h-8 rounded-full bg-white/80 border-zinc-200" asChild>
                                <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>
                                  <GithubIcon className="h-4 w-4 text-zinc-700" />
                                  <span className="sr-only">GitHub</span>
                                </a>
                              </Button>
                            )}

                            {project.liveUrl && (
                              <Button size="icon" variant="outline" className="w-8 h-8 rounded-full bg-white/80 border-zinc-200" asChild>
                                <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>
                                  <ExternalLinkIcon className="h-4 w-4 text-zinc-700" />
                                  <span className="sr-only">Live Preview</span>
                                </a>
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex-1 p-6">
                        <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-2 flex items-center">
                          {project.title}
                          <ArrowUpRightIcon className="ml-1.5 h-4 w-4 text-zinc-500 dark:text-zinc-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </h3>
                        <p className="text-zinc-600 dark:text-zinc-400 mb-4 line-clamp-2">
                          {project.description}
                        </p>
                        <div className="flex flex-wrap gap-2 mt-auto">
                          {project.tags.slice(0, 3).map((tag) => (
                            <span
                              key={tag}
                              className="inline-block text-xs px-2 py-1 rounded-full bg-zinc-100 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300"
                            >
                              {tag}
                            </span>
                          ))}
                          {project.tags.length > 3 && (
                            <span className="inline-block text-xs px-2 py-1 rounded-full bg-zinc-100 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300">
                              +{project.tags.length - 3}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="mt-12 text-center">
            <Button
              variant="outline"
              size="lg"
              onClick={() => setViewAll(!viewAll)}
              className="group"
            >
              {viewAll ? 'Show Featured Projects' : 'View All Projects'}
              <ArrowRightIcon className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </motion.div>
        </motion.div>
      </div>

      {/* Project Detail Dialog */}
      <Dialog open={!!selectedProject} onOpenChange={(open) => !open && setSelectedProject(null)}>
        <DialogContent className="max-w-4xl overflow-y-auto max-h-[90vh]">
          {selectedProject && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold">{selectedProject.title}</DialogTitle>
                <DialogDescription className="text-zinc-600 dark:text-zinc-400 mt-2">
                  {selectedProject.description}
                </DialogDescription>
              </DialogHeader>

              <div className="mt-4 relative aspect-video overflow-hidden rounded-lg">
                <Image
                  src={selectedProject.imageSrc}
                  alt={selectedProject.title}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                {selectedProject.details?.problem && (
                  <div>
                    <h4 className="text-lg font-semibold mb-2 text-zinc-900 dark:text-zinc-100">Problem</h4>
                    <p className="text-zinc-600 dark:text-zinc-400">{selectedProject.details.problem}</p>
                  </div>
                )}

                {selectedProject.details?.solution && (
                  <div>
                    <h4 className="text-lg font-semibold mb-2 text-zinc-900 dark:text-zinc-100">Solution</h4>
                    <p className="text-zinc-600 dark:text-zinc-400">{selectedProject.details.solution}</p>
                  </div>
                )}

                {selectedProject.details?.role && (
                  <div>
                    <h4 className="text-lg font-semibold mb-2 text-zinc-900 dark:text-zinc-100">My Role</h4>
                    <p className="text-zinc-600 dark:text-zinc-400">{selectedProject.details.role}</p>
                  </div>
                )}

                {selectedProject.details?.outcome && (
                  <div>
                    <h4 className="text-lg font-semibold mb-2 text-zinc-900 dark:text-zinc-100">Outcome</h4>
                    <p className="text-zinc-600 dark:text-zinc-400">{selectedProject.details.outcome}</p>
                  </div>
                )}
              </div>

              <div className="mt-6">
                <h4 className="text-lg font-semibold mb-2 text-zinc-900 dark:text-zinc-100">Technologies</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedProject.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-block text-sm px-3 py-1 rounded-full bg-zinc-100 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-6 flex gap-4">
                {selectedProject.githubUrl && (
                  <Button asChild className="flex-1">
                    <a href={selectedProject.githubUrl} target="_blank" rel="noopener noreferrer">
                      <GithubIcon className="mr-2 h-4 w-4" /> View Code
                    </a>
                  </Button>
                )}

                {selectedProject.liveUrl && (
                  <Button asChild variant="outline" className="flex-1">
                    <a href={selectedProject.liveUrl} target="_blank" rel="noopener noreferrer">
                      <ExternalLinkIcon className="mr-2 h-4 w-4" /> Live Demo
                    </a>
                  </Button>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </section>
  )
}

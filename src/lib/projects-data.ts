// src/lib/projects-data.ts

export type Project = {
    id: string;
    title: string;
    description: string;
    tags: string[];
    imageSrc: string;
    githubUrl?: string;
    liveUrl?: string;
    featured: boolean;
    details?: {
      problem?: string;
      solution?: string;
      technologies?: string[];
      role?: string;
      outcome?: string;
    };
  };
  
  export const projectsData: Project[] = [
    {
      id: "project-1",
      title: "Registration Modern Style",
      description: "A registration form, dashboard and others using php and mysql. A project for our programming strand. Mordern and Premium style.",
      tags: ["PHP", "CSS", "Hack"],
      imageSrc: "/registrationForm.png",
      githubUrl: "https://github.com/WilardzySenpai/Registration-Modern-Style",
      liveUrl: "https://Registration-Modern-Style.vercel.app",
      featured: true,
      details: {
        problem: "N/A",
        solution: "N/A",
        technologies: ["PHP", "CSS", "Hack"],
        role: "Full-stack developer responsible for architecture, frontend, and backend implementation.",
        outcome: "N/A"
      }
    },
    {
      id: "project-2",
      title: "Neon Shooting Game",
      description: "A simple 2 player shooting game made with HTML, CSS, and JavaScript only.",
      tags: ["HTML", "CSS", "JavaScript"],
      imageSrc: "/neonshooting.png",
      githubUrl: "https://github.com/WilardzySenpai/Neon-Shooting-Game",
      liveUrl: "https://wilardzysenpai.github.io/Neon-Shooting-Game/",
      featured: true,
      details: {
        problem: "N/A",
        solution: "N/A",
        technologies: ["HTML", "CSS", "JavaScript"],
        role: "N/A",
        outcome: "N/A"
      }
    },
    {
      id: "project-3",
      title: "WaifuMusic",
      description: "A music bot made with discord.js and distube for player.",
      tags: ["JavaScript", "Discord.JS"],
      imageSrc: "/waifumusic.png",
      githubUrl: "https://github.com/WilardzySenpai/WaifuMusic",
      liveUrl: "https://github.com/WilardzySenpai/WaifuMusic",
      featured: true,
      details: {
        problem: "N/A",
        solution: "N/A",
        technologies: ["JavaScript", "Discord.JS"],
        role: "N/A",
        outcome: "N/A"
      }
    },
    {
      id: "project-4",
      title: "Health & Fitness Tracker",
      description: "A mobile-first web application for tracking workouts, nutrition, and health metrics with personalized insights.",
      tags: ["React Native", "GraphQL", "Node.js", "MongoDB", "D3.js"],
      imageSrc: "/placeholder-project-4.png",
      githubUrl: "https://github.com/username/fitness-tracker",
      liveUrl: "https://fitness-tracker.vercel.app",
      featured: false,
      details: {
        problem: "Existing fitness apps lacked personalization and comprehensive data visualization.",
        solution: "Built a platform that combines activity tracking with machine learning to provide actionable health insights.",
        technologies: ["React Native", "GraphQL", "Node.js", "MongoDB", "D3.js", "TensorFlow.js"],
        role: "Lead developer responsible for frontend development and data visualization.",
        outcome: "Reached 10,000+ active users with 75% retention rate after 3 months."
      }
    },
    {
      id: "project-5",
      title: "DevOps Automation Framework",
      description: "An open-source framework for automating CI/CD pipelines, infrastructure provisioning, and monitoring alerts.",
      tags: ["Python", "Docker", "Kubernetes", "Terraform", "AWS"],
      imageSrc: "/placeholder-project-5.png",
      githubUrl: "https://github.com/username/devops-framework",
      liveUrl: "https://devops-framework-docs.vercel.app",
      featured: false,
      details: {
        problem: "Setting up DevOps infrastructure required specialized knowledge and repetitive configuration.",
        solution: "Developed a framework that simplifies deployment workflows with pre-configured templates and sensible defaults.",
        technologies: ["Python", "Docker", "Kubernetes", "Terraform", "AWS", "GitHub Actions"],
        role: "DevOps engineer and main contributor to the open-source project.",
        outcome: "900+ GitHub stars and adopted by multiple startups to streamline their deployment processes."
      }
    },
    {
      id: "project-6",
      title: "Educational Platform",
      description: "An interactive learning platform with video courses, coding challenges, and real-time feedback.",
      tags: ["Vue.js", "Express", "PostgreSQL", "WebSockets", "Docker"],
      imageSrc: "/placeholder-project-6.png",
      githubUrl: "https://github.com/username/educational-platform",
      liveUrl: "https://educational-platform.vercel.app",
      featured: false,
      details: {
        problem: "Traditional online learning lacks engagement and interactive feedback for programming courses.",
        solution: "Created a platform with live code execution, instant feedback, and interactive challenges.",
        technologies: ["Vue.js", "Express", "PostgreSQL", "WebSockets", "Docker", "Judge0 API"],
        role: "Backend developer focused on the code execution engine and feedback system.",
        outcome: "Used by 3 educational institutions with over 2,000 students actively learning to code."
      }
    }
  ];
  
  // Helper to get featured projects
  export const getFeaturedProjects = () => {
    return projectsData.filter(project => project.featured);
  };
  
  // Helper to get all projects
  export const getAllProjects = () => {
    return projectsData;
  };
  
  // Helper to get project by ID
  export const getProjectById = (id: string) => {
    return projectsData.find(project => project.id === id);
  };
  
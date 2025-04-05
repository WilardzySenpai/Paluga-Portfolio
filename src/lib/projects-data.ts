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
      title: "E-Commerce Platform",
      description: "A full-stack e-commerce platform with real-time inventory management, payment processing, and admin dashboard.",
      tags: ["Next.js", "TypeScript", "Tailwind CSS", "Prisma", "PostgreSQL", "Stripe"],
      imageSrc: "/placeholder-project-1.jpg",
      githubUrl: "https://github.com/username/e-commerce-platform",
      liveUrl: "https://e-commerce-platform.vercel.app",
      featured: true,
      details: {
        problem: "Traditional e-commerce solutions lacked real-time inventory updates and had complex admin interfaces.",
        solution: "Built a custom platform with WebSocket-based inventory tracking and an intuitive admin dashboard for non-technical users.",
        technologies: ["Next.js", "TypeScript", "Tailwind CSS", "Prisma", "PostgreSQL", "Stripe", "WebSockets"],
        role: "Full-stack developer responsible for architecture, frontend, and backend implementation.",
        outcome: "Increased sales by 35% and reduced admin time by 60% compared to previous solution."
      }
    },
    {
      id: "project-2",
      title: "AI Content Generator",
      description: "A SaaS platform that uses AI to generate marketing content, blog posts, and social media captions.",
      tags: ["React", "Node.js", "OpenAI API", "Express", "MongoDB", "Stripe"],
      imageSrc: "/placeholder-project-2.jpg",
      githubUrl: "https://github.com/username/ai-content-generator",
      liveUrl: "https://ai-content-generator.vercel.app",
      featured: true,
      details: {
        problem: "Small businesses struggle to maintain consistent content creation for marketing purposes.",
        solution: "Developed an AI-powered platform that generates high-quality content tailored to specific industries and tone preferences.",
        technologies: ["React", "Node.js", "OpenAI API", "Express", "MongoDB", "Stripe"],
        role: "Lead developer overseeing the entire product lifecycle.",
        outcome: "Acquired 500+ paying subscribers within first 3 months of launch."
      }
    },
    {
      id: "project-3",
      title: "Real-Time Collaboration Tool",
      description: "A collaborative workspace for remote teams with real-time document editing, video chat, and project management.",
      tags: ["Next.js", "WebRTC", "Socket.io", "Redis", "TypeScript"],
      imageSrc: "/placeholder-project-3.jpg",
      githubUrl: "https://github.com/username/collaboration-tool",
      liveUrl: "https://collaboration-tool.vercel.app",
      featured: true,
      details: {
        problem: "Remote teams faced challenges with synchronous collaboration across different tools and platforms.",
        solution: "Created an all-in-one workspace that combines document editing, communication, and project management.",
        technologies: ["Next.js", "WebRTC", "Socket.io", "Redis", "TypeScript", "PostgreSQL"],
        role: "Full-stack developer focused on real-time communication features and database architecture.",
        outcome: "Adopted by 20+ teams who reported 40% improved productivity in remote collaboration."
      }
    },
    {
      id: "project-4",
      title: "Health & Fitness Tracker",
      description: "A mobile-first web application for tracking workouts, nutrition, and health metrics with personalized insights.",
      tags: ["React Native", "GraphQL", "Node.js", "MongoDB", "D3.js"],
      imageSrc: "/placeholder-project-4.jpg",
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
      imageSrc: "/placeholder-project-5.jpg",
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
      imageSrc: "/placeholder-project-6.jpg",
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
  
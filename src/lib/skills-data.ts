// Define skill categories and their associated skills
export type Skill = {
    name: string;
    level: number; // 0-10
    category: "frontend" | "backend" | "devops" | "other";
    description?: string;
    color?: string; // For visual representation
  };
  
  export const skillsData: Skill[] = [
    // Frontend Skills
    {
      name: "React",
      level: 9,
      category: "frontend",
      description: "Building complex, responsive UIs with modern React patterns",
      color: "#61DAFB",
    },
    {
      name: "Next.js",
      level: 9,
      category: "frontend",
      description: "Full-stack React applications with server components & API routes",
      color: "#000000",
    },
    {
      name: "TypeScript",
      level: 8,
      category: "frontend",
      description: "Type-safe application development with advanced type features",
      color: "#3178C6",
    },
    {
      name: "Tailwind CSS",
      level: 9,
      category: "frontend",
      description: "Rapidly building custom designs without leaving your HTML",
      color: "#06B6D4",
    },
    {
      name: "Framer Motion",
      level: 7,
      category: "frontend",
      description: "Creating fluid animations and interactions",
      color: "#0055FF",
    },
    {
      name: "Three.js",
      level: 6,
      category: "frontend",
      description: "3D graphics and visualizations for the web",
      color: "#000000",
    },
    {
      name: "CSS/SCSS",
      level: 8,
      category: "frontend",
      description: "Advanced layouts, animations, and responsive design",
      color: "#1572B6",
    },
    {
      name: "HTML",
      level: 9,
      category: "frontend",
      description: "Semantic markup and accessibility",
      color: "#E34F26",
    },
  
    // Backend Skills
    {
      name: "Node.js",
      level: 8,
      category: "backend",
      description: "Building scalable server-side applications and APIs",
      color: "#339933",
    },
    {
      name: "Bun",
      level: 7,
      category: "backend",
      description: "Ultra-fast JavaScript runtime and bundler",
      color: "#FBF0DF",
    },
    {
      name: "Express",
      level: 8,
      category: "backend",
      description: "Building RESTful APIs and web services",
      color: "#000000",
    },
    {
      name: "PostgreSQL",
      level: 7,
      category: "backend",
      description: "Relational database design and optimization",
      color: "#4169E1",
    },
    {
      name: "MongoDB",
      level: 7,
      category: "backend",
      description: "Document-based database modeling and queries",
      color: "#47A248",
    },
    {
      name: "GraphQL",
      level: 6,
      category: "backend",
      description: "Efficient API development with precise data fetching",
      color: "#E10098",
    },
    {
      name: "Prisma",
      level: 7,
      category: "backend",
      description: "Type-safe database access with ORM capabilities",
      color: "#2D3748",
    },
  
    // DevOps Skills
    {
      name: "Docker",
      level: 7,
      category: "devops",
      description: "Containerization for consistent deployment environments",
      color: "#2496ED",
    },
    {
      name: "Git",
      level: 8,
      category: "devops",
      description: "Version control and collaboration workflows",
      color: "#F05032",
    },
    {
      name: "CI/CD",
      level: 7,
      category: "devops",
      description: "Automated testing and deployment pipelines",
      color: "#4078c0",
    },
    {
      name: "AWS",
      level: 6,
      category: "devops",
      description: "Cloud infrastructure and serverless architecture",
      color: "#FF9900",
    },
    {
      name: "Vercel",
      level: 8,
      category: "devops",
      description: "Frontend deployment and edge functions",
      color: "#000000",
    },
  
    // Other Skills
    {
      name: "Testing",
      level: 7,
      category: "other",
      description: "Unit, integration, and E2E testing with Jest and Cypress",
      color: "#C21325",
    },
    {
      name: "Accessibility",
      level: 7,
      category: "other",
      description: "Building inclusive applications with WCAG compliance",
      color: "#005A9C",
    },
    {
      name: "Performance",
      level: 8,
      category: "other",
      description: "Web vitals optimization and bundle size reduction",
      color: "#4285F4",
    },
    {
      name: "SEO",
      level: 7,
      category: "other",
      description: "Search engine optimization and structured data",
      color: "#FBBC05",
    },
  ];
  
  // Group skills by category for easier rendering
  export const skillsByCategory = skillsData.reduce((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = [];
    }
    acc[skill.category].push(skill);
    return acc;
  }, {} as Record<Skill["category"], Skill[]>);
  
  // Get random positions for the 3D visualization
  export const getRandomSpherePosition = (radius: number) => {
    const theta = Math.random() * Math.PI * 2; // Random angle around the sphere
    const phi = Math.acos(2 * Math.random() - 1); // Random angle from top to bottom
  
    const x = radius * Math.sin(phi) * Math.cos(theta);
    const y = radius * Math.sin(phi) * Math.sin(theta);
    const z = radius * Math.cos(phi);
  
    return [x, y, z];
  };
  
  // Calculate skill positions in 3D space for visualization
  export function generateSkillsPositions(skills: Skill[], baseRadius = 5) {
    return skills.map((skill) => {
      // Adjust distance from center based on skill level (higher level = closer to center)
      const radius = baseRadius - (skill.level / 10) * 2;
      const position = getRandomSpherePosition(radius);
  
      return {
        ...skill,
        position,
      };
    });
  }
  
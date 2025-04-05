// src/lib/offering-data.ts

import type { LucideIcon } from "lucide-react";
import {
  Code2Icon,
  DatabaseIcon,
  GaugeIcon,
  CloudIcon,
  ServerIcon,
  ShieldIcon,
  BrainCircuitIcon,
  LayoutDashboardIcon,
} from "lucide-react";

export type Offering = {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  benefits: string[];
  featured: boolean;
};

export const offeringsData: Offering[] = [
  {
    id: "full-stack-development",
    title: "Full-Stack Development",
    description:
      "End-to-end development of web applications with modern frontend frameworks and scalable backend architecture.",
    icon: Code2Icon,
    benefits: [
      "Responsive and accessible user interfaces",
      "Optimized performance and core web vitals",
      "Server-side rendering and SEO optimization",
      "Secure API development and authentication",
    ],
    featured: true,
  },
  {
    id: "api-development",
    title: "API Development",
    description:
      "Design and implementation of RESTful or GraphQL APIs with proper documentation and security measures.",
    icon: DatabaseIcon,
    benefits: [
      "RESTful or GraphQL architecture based on project needs",
      "Comprehensive data validation and error handling",
      "Authentication and authorization mechanisms",
      "Detailed API documentation and testing",
    ],
    featured: true,
  },
  {
    id: "performance-optimization",
    title: "Performance Optimization",
    description:
      "Analysis and enhancement of application performance, focusing on loading times, rendering efficiency, and database queries.",
    icon: GaugeIcon,
    benefits: [
      "Core Web Vitals improvement",
      "Bundle size optimization",
      "Database query optimization",
      "Image and asset optimization strategies",
    ],
    featured: true,
  },
  {
    id: "cloud-deployment",
    title: "Cloud Deployment",
    description:
      "Setup and configuration of cloud infrastructure for reliable, scalable, and cost-effective application hosting.",
    icon: CloudIcon,
    benefits: [
      "Infrastructure as Code (IaC) setup",
      "Automated deployment pipelines",
      "Scalable architecture design",
      "Cost optimization strategies",
    ],
    featured: false,
  },
  {
    id: "devops-automation",
    title: "DevOps Automation",
    description:
      "Streamlining development workflows with CI/CD pipelines, containerization, and infrastructure automation.",
    icon: ServerIcon,
    benefits: [
      "CI/CD pipeline configuration",
      "Docker and Kubernetes deployment",
      "Monitoring and alerting systems",
      "Infrastructure scaling solutions",
    ],
    featured: false,
  },
  {
    id: "security-auditing",
    title: "Security Auditing",
    description:
      "Comprehensive analysis of application security, identifying vulnerabilities and implementing best practices for data protection.",
    icon: ShieldIcon,
    benefits: [
      "Vulnerability assessment and penetration testing",
      "Authentication and authorization review",
      "Data encryption and protection strategies",
      "Security best practices implementation",
    ],
    featured: false,
  },
  {
    id: "ai-integration",
    title: "AI Integration",
    description:
      "Incorporating artificial intelligence capabilities into web applications for enhanced functionality and user experience.",
    icon: BrainCircuitIcon,
    benefits: [
      "Natural language processing features",
      "Content generation and analysis",
      "Recommendation systems",
      "Personalization algorithms",
    ],
    featured: false,
  },
  {
    id: "custom-admin-dashboards",
    title: "Custom Admin Dashboards",
    description:
      "Development of tailored administration interfaces for efficient content and user management.",
    icon: LayoutDashboardIcon,
    benefits: [
      "Intuitive content management systems",
      "Real-time data visualization",
      "User management and permissions",
      "Custom analytics and reporting",
    ],
    featured: false,
  },
];

// Helper to get featured offerings
export const getFeaturedOfferings = () => {
  return offeringsData.filter((offering) => offering.featured);
};

// Helper to get all offerings
export const getAllOfferings = () => {
  return offeringsData;
};

// Helper to get offering by ID
export const getOfferingById = (id: string) => {
  return offeringsData.find((offering) => offering.id === id);
};

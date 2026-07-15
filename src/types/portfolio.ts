export interface NavigationItem {
  label: string;
  href: `#${string}`;
}

export interface SocialLink {
  label: string;
  href: string;
  kind: 'github' | 'linkedin' | 'whatsapp' | 'instagram';
}

export interface Project {
  id: string;
  title: string;
  category: string;
  summary: string;
  context: string;
  solution: string;
  features: string[];
  technologies: string[];
  status: string;
  image?: string;
  imageAlt?: string;
  featured?: boolean;
}

export interface Experience {
  organization: string;
  role: string;
  type: string;
  dates: string;
  location?: string;
  description: string;
  responsibilities: string[];
  technologies?: string[];
  certificate?: string;
}

export interface EducationItem {
  degree: string;
  institution: string;
  dates: string;
  detail: string;
}

export interface SkillGroup {
  title: string;
  description: string;
  skills: string[];
}

export interface Service {
  title: string;
  description: string;
  signal: string;
}

export interface Certificate {
  title: string;
  context: string;
  image: string;
  alt: string;
}

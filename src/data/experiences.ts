import type { Experience } from '@/types/portfolio';

export const experiences: Experience[] = [
  {
    organization: 'EST Khénifra',
    role: 'Digital Transformation Intern',
    type: 'Internship',
    dates: 'Academic internship',
    location: 'Khénifra, Morocco',
    description:
      'Designed, developed, deployed, documented, and supported two university platforms: digital administration and SmartPresence.',
    responsibilities: [
      'Mapped administrative and attendance workflows',
      'Built full-stack interfaces and role-based dashboards',
      'Integrated computer vision into attendance operations',
      'Configured and supported Linux deployment',
    ],
    technologies: ['Laravel', 'Python', 'OpenCV', 'MySQL', 'Linux', 'Nginx'],
  },
  {
    organization: 'Club Leaders of Tomorrow',
    role: 'Founder & Design Lead',
    type: 'Student leadership',
    dates: 'Ongoing association work',
    location: 'EST Khénifra',
    description:
      'Created the club, shaped its visual identity, and supported the coordination of academic and association events.',
    responsibilities: [
      'Designed the identity and communication materials',
      'Co-organized The First Step at EST Khénifra',
      'Helped coordinate an international language-learning colloquium',
      'Collaborated with students and university administration',
    ],
    technologies: ['Figma', 'Adobe Illustrator', 'Web design', 'Event coordination'],
    certificate: 'assets/certificate-language.webp',
  },
  {
    organization: 'ONEE',
    role: 'Commercial Activities Intern',
    type: 'Initiation internship',
    dates: '14 Jul — 13 Aug 2025',
    location: 'Errachidia, Morocco',
    description:
      'Observed the technical and administrative operation of a public institution and contributed to follow-up and organization tasks.',
    responsibilities: [
      'Observed technical and administrative service activities',
      'Supported selected monitoring and organization tasks',
      'Developed professional rigor and adaptability',
      'Worked within public-service team processes',
    ],
    certificate: 'assets/certificate-onee.webp',
  },
];

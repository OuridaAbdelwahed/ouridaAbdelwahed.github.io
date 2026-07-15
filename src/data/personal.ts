import type { SocialLink } from '@/types/portfolio';

export const personal = {
  name: 'Abdelwahed Ourida',
  initials: 'AO',
  role: 'Data Engineering & AI Student · Full-Stack Developer',
  shortRole: 'Data + AI · Full-Stack',
  location: 'Errachidia, Morocco',
  email: 'ouridaabdelwahed@gmail.com',
  phone: '+212 6 74 95 94 42',
  introduction:
    'I design and build useful digital systems across full-stack web development, data engineering, artificial intelligence, and deployment.',
  profile:
    'A motivated Data Engineering and Artificial Intelligence student with a strong full-stack foundation and experience translating real operational needs into working technical products.',
  availability: 'Open to internships and serious project collaborations.',
  languages: ['Arabic', 'French — good working level', 'English — intermediate'],
  cvPath: 'assets/Abdelwahed-Ourida-CV.pdf',
  heroCasaDesktop: 'images/hero/casa-desktop.webp',
  heroCasaMobile: 'images/hero/casa-mobile.webp',
  heroOriginalDesktop: 'images/hero/original-desktop-aligned.webp',
  heroOriginalMobile: 'images/hero/original-mobile-aligned.webp',
} as const;

export const socialLinks: SocialLink[] = [
  {
    label: 'Open GitHub profile',
    href: 'https://github.com/OuridaAbdelwahed',
    kind: 'github',
  },
  {
    label: 'Open LinkedIn profile',
    href: 'https://www.linkedin.com/in/ourida-abdelwahed/',
    kind: 'linkedin',
  },
  {
    label: 'Open WhatsApp chat',
    href: 'https://wa.me/212674959442',
    kind: 'whatsapp',
  },
  {
    label: 'Open Instagram profile',
    href: 'https://www.instagram.com/1bdul__/',
    kind: 'instagram',
  },
];

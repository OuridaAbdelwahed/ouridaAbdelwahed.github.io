import type { Project } from '@/types/portfolio';

export const projects: Project[] = [
  {
    id: 'smart-presence',
    title: 'SmartPresence',
    category: 'AI · Computer Vision',
    summary:
      'An intelligent attendance platform built around facial recognition and usable administrative workflows.',
    context:
      'Developed during the EST Khénifra internship as one of two digital transformation platforms.',
    solution:
      'Combined face registration, real-time attendance tracking, role-based dashboards, absence reports, and Linux deployment.',
    features: [
      'Face registration',
      'Real-time attendance',
      'Absence reporting',
      'Administrative dashboards',
    ],
    technologies: ['Python', 'OpenCV', 'Laravel', 'MySQL', 'Nginx', 'Linux'],
    status: 'Deployed internship project',
    image: 'assets/originals/img4.jpeg',
    imageAlt: 'Abdelwahed presenting the SmartPresence login interface',
    featured: true,
  },
  {
    id: 'est-administration',
    title: 'EST Khénifra Digital Administration',
    category: 'Business Software · Full-Stack',
    summary:
      'A digital administration platform for documents, requests, files, dashboards, and multi-role access.',
    context:
      'Created for university administrative workflows and integrated with the institution’s digital environment.',
    solution:
      'Structured common request and document processes into a secure, role-aware web application.',
    features: [
      'Document requests',
      'File workflows',
      'Role-based access',
      'Operational dashboards',
    ],
    technologies: ['Laravel', 'PHP', 'MySQL', 'JavaScript', 'Bootstrap'],
    status: 'Production-oriented internship project',
    featured: true,
  },
  {
    id: 'event-ticketing',
    title: 'Event E-Ticketing Platform',
    category: 'Events · QR Validation',
    summary:
      'A multilingual event system covering ticket generation, entry validation, categories, and statistics.',
    context: 'An academic and personal project for managing the complete event attendance flow.',
    solution:
      'Created unique QR tickets with a validation interface, user administration, and reporting views.',
    features: ['Unique QR tickets', 'Entry validation', 'Multilingual UI', 'Event statistics'],
    technologies: ['PHP', 'PDO', 'MySQL', 'Node.js', 'Chart.js', 'Bootstrap', 'i18n'],
    status: 'Academic and personal project',
  },
  {
    id: 'izar-parfums',
    title: 'Izar Parfums',
    category: 'E-Commerce',
    summary:
      'A responsive perfume storefront with catalog, cart, checkout, inventory, orders, and administration.',
    context:
      'Built to explore complete e-commerce flows from product discovery to back-office operations.',
    solution:
      'Connected customer-facing shopping journeys to product, stock, order, and account management.',
    features: ['Catalog and categories', 'Cart and checkout', 'Inventory', 'Admin dashboard'],
    technologies: ['PHP', 'PDO', 'MySQL', 'JavaScript', 'Chart.js', 'Bootstrap'],
    status: 'Academic and personal project',
  },
  {
    id: 'habchi-marbre',
    title: 'Habchi Marbre Stock Management',
    category: 'Desktop · Operations',
    summary: 'A desktop inventory system for day-to-day marble and granite stock operations.',
    context:
      'Designed around purchases, sales, suppliers, customers, and practical inventory visibility.',
    solution:
      'Unified routine stock movements, alerts, partner records, and reports in a desktop interface.',
    features: [
      'Purchase and sales tracking',
      'Stock alerts',
      'Supplier records',
      'Operational reports',
    ],
    technologies: ['Python', 'PyQt', 'SQLite'],
    status: 'Business software project',
  },
  {
    id: 'zenata-city',
    title: 'Zenata City Digital Platform',
    category: 'Civic Services · Full-Stack',
    summary:
      'A municipal services concept for public information, requests, news, and administration.',
    context: 'A full-stack project focused on clear citizen access to digital municipal services.',
    solution:
      'Built public and administrative experiences around service requests and managed information.',
    features: ['Citizen requests', 'Public information', 'News management', 'Admin dashboards'],
    technologies: ['React', 'Node.js', 'Express.js', 'MySQL'],
    status: 'Full-stack project',
  },
];

import { AnimatePresence, motion, useScroll, useSpring } from 'motion/react';
import { ArrowDownToLine, Menu, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import type { NavigationItem } from '@/types/portfolio';
import { motionEasings } from '@/utils/motion';

interface HeaderProps {
  navigation: NavigationItem[];
  cvHref: string;
}

export function Header({ navigation, cvHref }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeId, setActiveId] = useState('home');
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 160, damping: 28, mass: 0.3 });

  useEffect(() => {
    const sections = [...document.querySelectorAll<HTMLElement>('main section[id]')];
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target.id) setActiveId(visible.target.id);
      },
      { rootMargin: '-30% 0px -58%', threshold: [0.05, 0.2, 0.5] },
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    closeButtonRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false);
    };
    document.body.classList.add('menu-is-open');
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.classList.remove('menu-is-open');
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [menuOpen]);

  return (
    <>
      <motion.div className="scroll-progress" style={{ scaleX: progress }} aria-hidden="true" />
      <header className="site-header">
        <a className="brand-mark magnetic" href="#home" aria-label="Abdelwahed Ourida — home">
          <span>AO</span>
          <i aria-hidden="true" />
        </a>
        <nav className="desktop-nav" aria-label="Primary navigation">
          {navigation.map((item) => (
            <a
              key={item.href}
              className={activeId === item.href.slice(1) ? 'is-active' : undefined}
              href={item.href}
              aria-current={activeId === item.href.slice(1) ? 'location' : undefined}
            >
              {item.label}
            </a>
          ))}
        </nav>
        <div className="header-actions">
          <a className="cv-pill magnetic" href={cvHref} target="_blank" rel="noreferrer">
            <ArrowDownToLine size={16} aria-hidden="true" />
            CV
          </a>
          <button
            className="menu-toggle"
            type="button"
            onClick={() => setMenuOpen(true)}
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
            aria-label="Open navigation"
          >
            <Menu size={21} aria-hidden="true" />
          </button>
        </div>
      </header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            id="mobile-navigation"
            className="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Navigation"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <motion.div
              className="mobile-menu-panel"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.46, ease: motionEasings.smooth }}
            >
              <div className="mobile-menu-head">
                <span>Navigate / AO</span>
                <button
                  ref={closeButtonRef}
                  type="button"
                  onClick={() => setMenuOpen(false)}
                  aria-label="Close navigation"
                >
                  <X size={22} aria-hidden="true" />
                </button>
              </div>
              <nav aria-label="Mobile navigation">
                {navigation.map((item, index) => (
                  <motion.a
                    key={item.href}
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    initial={{ opacity: 0, x: 24 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.08 + index * 0.045 }}
                  >
                    <span>0{index + 1}</span>
                    {item.label}
                  </motion.a>
                ))}
              </nav>
              <a className="mobile-cv" href={cvHref} target="_blank" rel="noreferrer">
                Download CV <ArrowDownToLine size={18} aria-hidden="true" />
              </a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

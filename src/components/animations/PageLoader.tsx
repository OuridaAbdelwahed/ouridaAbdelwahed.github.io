import { AnimatePresence, motion } from 'motion/react';
import { useEffect, useState } from 'react';

export function PageLoader() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const finish = () => setVisible(false);
    const timeout = window.setTimeout(finish, 1100);
    window.addEventListener('hero-textures-ready', finish, { once: true });
    if (document.readyState === 'complete') window.setTimeout(finish, 360);
    else window.addEventListener('load', finish, { once: true });

    return () => {
      window.clearTimeout(timeout);
      window.removeEventListener('hero-textures-ready', finish);
      window.removeEventListener('load', finish);
    };
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="page-loader"
          role="status"
          aria-label="Loading portrait experience"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.45 } }}
        >
          <div className="loader-mark" aria-hidden="true">
            <span>AO</span>
            <i />
          </div>
          <span className="sr-only">Loading portfolio</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

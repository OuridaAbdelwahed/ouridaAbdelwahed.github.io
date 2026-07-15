import { AnimatePresence, motion } from 'motion/react';
import { Expand, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import type { Certificate } from '@/types/portfolio';
import { motionEasings } from '@/utils/motion';

interface ImageLightboxProps {
  certificates: Certificate[];
}

export function ImageLightbox({ certificates }: ImageLightboxProps) {
  const [selected, setSelected] = useState<Certificate | null>(null);
  const closeButton = useRef<HTMLButtonElement>(null);
  const lastTrigger = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (!selected) return;
    closeButton.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setSelected(null);
    };
    document.body.classList.add('modal-is-open');
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.classList.remove('modal-is-open');
      document.removeEventListener('keydown', onKeyDown);
      lastTrigger.current?.focus();
    };
  }, [selected]);

  return (
    <>
      <div className="certificate-grid">
        {certificates.map((certificate, index) => (
          <motion.button
            className="certificate-card"
            type="button"
            key={certificate.title}
            onClick={(event) => {
              lastTrigger.current = event.currentTarget;
              setSelected(certificate);
            }}
            whileHover={{ y: -6 }}
            whileTap={{ scale: 0.985 }}
            transition={{ duration: 0.32, ease: motionEasings.smooth }}
          >
            <div className="certificate-image-shell">
              <img
                src={certificate.image}
                alt={certificate.alt}
                loading="lazy"
                width={1200}
                height={850}
              />
              <span aria-hidden="true">
                <Expand size={18} /> View
              </span>
            </div>
            <span className="certificate-index">0{index + 1}</span>
            <div>
              <h3>{certificate.title}</h3>
              <p>{certificate.context}</p>
            </div>
          </motion.button>
        ))}
      </div>

      <AnimatePresence>
        {selected && (
          <motion.div
            className="lightbox"
            role="dialog"
            aria-modal="true"
            aria-label={selected.title}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <button className="lightbox-backdrop" type="button" onClick={() => setSelected(null)}>
              <span className="sr-only">Close certificate preview</span>
            </button>
            <motion.div
              className="lightbox-panel"
              initial={{ opacity: 0, y: 24, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 14, scale: 0.985 }}
              transition={{ duration: 0.42, ease: motionEasings.smooth }}
            >
              <button
                ref={closeButton}
                className="lightbox-close"
                type="button"
                onClick={() => setSelected(null)}
                aria-label="Close certificate preview"
              >
                <X size={20} aria-hidden="true" />
              </button>
              <img src={selected.image} alt={selected.alt} />
              <div>
                <span>Verified experience</span>
                <strong>{selected.title}</strong>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

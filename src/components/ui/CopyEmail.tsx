import { AnimatePresence, motion } from 'motion/react';
import { Check, Copy, Mail } from 'lucide-react';
import { useEffect, useState } from 'react';

interface CopyEmailProps {
  email: string;
}

export function CopyEmail({ email }: CopyEmailProps) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timer = window.setTimeout(() => setCopied(false), 2200);
    return () => window.clearTimeout(timer);
  }, [copied]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
    } catch {
      window.location.href = `mailto:${email}`;
    }
  };

  return (
    <div className="copy-email">
      <a href={`mailto:${email}`}>
        <Mail size={18} aria-hidden="true" />
        <span>{email}</span>
      </a>
      <motion.button
        type="button"
        onClick={copy}
        whileTap={{ scale: 0.94 }}
        aria-label={`Copy ${email}`}
      >
        <AnimatePresence mode="wait" initial={false}>
          {copied ? (
            <motion.span
              key="copied"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              <Check size={17} aria-hidden="true" /> Copied
            </motion.span>
          ) : (
            <motion.span key="copy" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <Copy size={17} aria-hidden="true" /> Copy
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>
      <span className="sr-only" aria-live="polite">
        {copied ? 'Email copied to clipboard' : ''}
      </span>
    </div>
  );
}

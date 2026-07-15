import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { useEffect } from 'react';
import { useReducedMotionPreference } from '@/hooks/useReducedMotionPreference';

export function MotionOrchestrator() {
  const reducedMotion = useReducedMotionPreference();

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    if (reducedMotion) {
      gsap.set('[data-reveal]', { opacity: 1, clearProps: 'transform,filter' });
      return;
    }

    const lenis = new Lenis({
      duration: 1.05,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      syncTouch: false,
    });
    const updateLenis = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(updateLenis);
    gsap.ticker.lagSmoothing(0);

    const context = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach((element) => {
        gsap.fromTo(
          element,
          { y: 42, opacity: 0, filter: 'blur(8px)' },
          {
            y: 0,
            opacity: 1,
            filter: 'blur(0px)',
            duration: 0.9,
            ease: 'power4.out',
            scrollTrigger: {
              trigger: element,
              start: 'top 88%',
              once: true,
            },
          },
        );
      });

      gsap.utils.toArray<HTMLElement>('[data-parallax]').forEach((element) => {
        gsap.fromTo(
          element,
          { yPercent: -3 },
          {
            yPercent: 7,
            ease: 'none',
            scrollTrigger: {
              trigger: element.parentElement,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 0.8,
            },
          },
        );
      });

      const timelineLine = document.querySelector<HTMLElement>('[data-timeline-line]');
      if (timelineLine) {
        gsap.fromTo(
          timelineLine,
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: '[data-timeline]',
              start: 'top 72%',
              end: 'bottom 65%',
              scrub: true,
            },
          },
        );
      }

      gsap.fromTo(
        '[data-hero-word]',
        { yPercent: 112, rotate: 1.2 },
        {
          yPercent: 0,
          rotate: 0,
          duration: 1.05,
          stagger: 0.08,
          delay: 0.16,
          ease: 'power4.out',
        },
      );
    });

    const onVisibility = () => {
      if (document.hidden) lenis.stop();
      else lenis.start();
    };
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      document.removeEventListener('visibilitychange', onVisibility);
      context.revert();
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
      gsap.ticker.remove(updateLenis);
      lenis.destroy();
    };
  }, [reducedMotion]);

  return null;
}

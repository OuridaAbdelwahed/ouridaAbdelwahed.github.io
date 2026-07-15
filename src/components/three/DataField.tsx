import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Line, Sphere } from '@react-three/drei';
import { useEffect, useMemo, useRef, useState } from 'react';
import type { Group } from 'three';
import { useReducedMotionPreference } from '@/hooks/useReducedMotionPreference';

interface NetworkProps {
  active: boolean;
  reducedMotion: boolean;
}

function Network({ active, reducedMotion }: NetworkProps) {
  const group = useRef<Group>(null);
  const invalidate = useThree((state) => state.invalidate);
  const points = useMemo(
    () =>
      Array.from({ length: 18 }, (_, index) => {
        const angle = index * 2.399;
        const radius = 1.05 + (index % 4) * 0.22;
        return [Math.cos(angle) * radius, Math.sin(angle * 1.13) * 0.92, Math.sin(angle) * 0.7] as [
          number,
          number,
          number,
        ];
      }),
    [],
  );

  useFrame((state, delta) => {
    if (!active || reducedMotion || !group.current) return;
    group.current.rotation.y += delta * 0.065;
    group.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.22) * 0.055;
    invalidate();
  });

  return (
    <group ref={group} rotation={[0.08, -0.28, 0]}>
      {points.map((point, index) => (
        <Sphere key={index} args={[index % 5 === 0 ? 0.075 : 0.043, 12, 12]} position={point}>
          <meshBasicMaterial color={index % 5 === 0 ? '#82e9ff' : '#6b7dff'} />
        </Sphere>
      ))}
      {points.map((point, index) => {
        const next = points[(index * 5 + 3) % points.length];
        if (!next) return null;
        return (
          <Line
            key={`line-${index}`}
            points={[point, next]}
            color={index % 4 === 0 ? '#42d9e8' : '#445080'}
            transparent
            opacity={index % 4 === 0 ? 0.5 : 0.22}
            lineWidth={0.6}
          />
        );
      })}
    </group>
  );
}

export function DataField() {
  const wrapper = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);
  const reducedMotion = useReducedMotionPreference();

  useEffect(() => {
    const element = wrapper.current;
    if (!element) return;
    const observer = new IntersectionObserver(
      ([entry]) => setActive(Boolean(entry?.isIntersecting)),
      { rootMargin: '120px' },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={wrapper} className="data-field" aria-hidden="true">
      <Canvas
        frameloop="demand"
        dpr={[1, 1.4]}
        camera={{ position: [0, 0, 5], fov: 42 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        onCreated={(state) => {
          const host = state.gl.domElement.parentElement;
          const rect = host?.getBoundingClientRect();
          if (rect && rect.width > 0 && rect.height > 0) {
            state.setSize(rect.width, rect.height);
            state.invalidate();
          }
        }}
      >
        <Network active={active} reducedMotion={reducedMotion} />
      </Canvas>
      <div className="data-field-fallback" />
    </div>
  );
}

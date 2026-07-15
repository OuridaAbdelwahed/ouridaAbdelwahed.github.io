import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber';
import { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { LinearFilter, SRGBColorSpace, TextureLoader, Vector2 } from 'three';
import { useReducedMotionPreference } from '@/hooks/useReducedMotionPreference';
import { getCoverScale } from '@/utils/coverTexture';
import { createWaterRippleMaterial, type WaterRippleMaterial } from './WaterRippleMaterial';

interface InteractionState {
  pointer: Vector2;
  previousPointer: Vector2;
  targetProgress: number;
  velocity: number;
  lastInteraction: number;
}

interface RipplePlaneProps {
  primaryImage: string;
  secondaryImage: string;
  imageWidth: number;
  imageHeight: number;
  rippleStrength: number;
  secondaryScale: readonly [number, number];
  secondaryOffset: readonly [number, number];
  interaction: React.RefObject<InteractionState>;
}

function RipplePlane({
  primaryImage,
  secondaryImage,
  imageWidth,
  imageHeight,
  rippleStrength,
  secondaryScale,
  secondaryOffset,
  interaction,
}: RipplePlaneProps) {
  const textures = useLoader(TextureLoader, [primaryImage, secondaryImage]);
  const primaryTexture = textures[0]!;
  const secondaryTexture = textures[1]!;
  const material = useMemo(() => createWaterRippleMaterial(), []);
  const materialRef = useRef<WaterRippleMaterial>(material);
  const viewport = useThree((state) => state.viewport);
  const size = useThree((state) => state.size);
  const invalidate = useThree((state) => state.invalidate);

  useEffect(() => {
    [primaryTexture, secondaryTexture].forEach((texture) => {
      texture.colorSpace = SRGBColorSpace;
      texture.minFilter = LinearFilter;
      texture.magFilter = LinearFilter;
      texture.needsUpdate = true;
    });
    material.uniforms.uTexturePrimary.value = primaryTexture;
    material.uniforms.uTextureSecondary.value = secondaryTexture;
    material.uniforms.uRippleStrength.value = rippleStrength;
    material.uniforms.uSecondaryScale.value.set(secondaryScale[0], secondaryScale[1]);
    material.uniforms.uSecondaryOffset.value.set(secondaryOffset[0], secondaryOffset[1]);
    window.dispatchEvent(new Event('hero-textures-ready'));
    invalidate();

    return () => material.dispose();
  }, [
    invalidate,
    material,
    primaryTexture,
    rippleStrength,
    secondaryOffset,
    secondaryScale,
    secondaryTexture,
  ]);

  useEffect(() => {
    const scale = getCoverScale(size.width, size.height, imageWidth, imageHeight);
    material.uniforms.uResolution.value.set(size.width, size.height);
    material.uniforms.uCoverScale.value.set(scale.x, scale.y);
    invalidate();
  }, [imageHeight, imageWidth, invalidate, material, size.height, size.width]);

  useFrame((state, delta) => {
    const input = interaction.current;
    if (!input) return;
    const uniforms = materialRef.current.uniforms;
    const now = performance.now();
    const age = Math.max(0, (now - input.lastInteraction) / 1000);
    const currentProgress = Number(uniforms.uProgress.value);
    const nextProgress =
      currentProgress + (input.targetProgress - currentProgress) * Math.min(1, delta * 8.2);

    uniforms.uTime.value = state.clock.elapsedTime;
    uniforms.uPulseAge.value = age;
    uniforms.uProgress.value = nextProgress;
    uniforms.uPointerVelocity.value = input.velocity;
    (uniforms.uPointer.value as Vector2).lerp(input.pointer, Math.min(1, delta * 17));
    (uniforms.uPreviousPointer.value as Vector2).lerp(
      input.previousPointer,
      Math.min(1, delta * 10),
    );
    input.velocity *= Math.pow(0.035, delta);

    if (age < 1.8 || Math.abs(input.targetProgress - nextProgress) > 0.002) invalidate();
  });

  return (
    <mesh scale={[viewport.width, viewport.height, 1]}>
      <planeGeometry args={[1, 1, 1, 1]} />
      <primitive ref={materialRef} object={material} attach="material" />
    </mesh>
  );
}

export interface WaterRippleImageProps {
  primaryImage: string;
  secondaryImage: string;
  mobilePrimaryImage: string;
  mobileSecondaryImage: string;
  primaryAlt: string;
  secondaryAlt: string;
  width: number;
  height: number;
  mobileWidth: number;
  mobileHeight: number;
  secondaryScale?: readonly [number, number];
  secondaryOffset?: readonly [number, number];
  mobileSecondaryScale?: readonly [number, number];
  mobileSecondaryOffset?: readonly [number, number];
  rippleStrength?: number;
  className?: string;
}

export function WaterRippleImage({
  primaryImage,
  secondaryImage,
  mobilePrimaryImage,
  mobileSecondaryImage,
  primaryAlt,
  secondaryAlt,
  width,
  height,
  mobileWidth,
  mobileHeight,
  secondaryScale = [1, 1],
  secondaryOffset = [0, 0],
  mobileSecondaryScale = secondaryScale,
  mobileSecondaryOffset = secondaryOffset,
  rippleStrength = 0.58,
  className = '',
}: WaterRippleImageProps) {
  const reducedMotion = useReducedMotionPreference();
  const [webglAvailable, setWebglAvailable] = useState<boolean | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [locked, setLocked] = useState(false);
  const pointerDown = useRef<{ x: number; y: number; moved: boolean } | null>(null);
  const lastMove = useRef({ x: 0.5, y: 0.5, time: performance.now() });
  const interaction = useRef<InteractionState>({
    pointer: new Vector2(0.5, 0.5),
    previousPointer: new Vector2(0.5, 0.5),
    targetProgress: 0,
    velocity: 0,
    lastInteraction: -10000,
  });

  useEffect(() => {
    const media = window.matchMedia('(max-width: 720px)');
    const updateBreakpoint = () => setIsMobile(media.matches);
    updateBreakpoint();
    media.addEventListener('change', updateBreakpoint);

    const canvas = document.createElement('canvas');
    const context = canvas.getContext('webgl2', { failIfMajorPerformanceCaveat: true });
    setWebglAvailable(Boolean(context));
    context?.getExtension('WEBGL_lose_context')?.loseContext();

    return () => media.removeEventListener('change', updateBreakpoint);
  }, []);

  const activePrimaryImage = isMobile ? mobilePrimaryImage : primaryImage;
  const activeSecondaryImage = isMobile ? mobileSecondaryImage : secondaryImage;
  const activeWidth = isMobile ? mobileWidth : width;
  const activeHeight = isMobile ? mobileHeight : height;
  const activeSecondaryScale = isMobile ? mobileSecondaryScale : secondaryScale;
  const activeSecondaryOffset = isMobile ? mobileSecondaryOffset : secondaryOffset;
  const displaySecondaryScale = 1 / activeSecondaryScale[0];
  const displaySecondaryLeft = (-activeSecondaryOffset[0] / activeSecondaryScale[0]) * 100;
  const displaySecondaryTop = (-activeSecondaryOffset[1] / activeSecondaryScale[1]) * 100;

  const updatePointer = (event: React.PointerEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = Math.min(1, Math.max(0, (event.clientX - rect.left) / rect.width));
    const y = Math.min(1, Math.max(0, 1 - (event.clientY - rect.top) / rect.height));
    const now = performance.now();
    const elapsed = Math.max(now - lastMove.current.time, 12);
    const distance = Math.hypot(x - lastMove.current.x, y - lastMove.current.y);
    const velocity = Math.min(2, (distance / elapsed) * 900);

    interaction.current.previousPointer.copy(interaction.current.pointer);
    interaction.current.pointer.set(x, y);
    interaction.current.velocity = velocity;
    interaction.current.lastInteraction = now;
    lastMove.current = { x, y, time: now };
    event.currentTarget.style.setProperty('--reveal-x', `${x * 100}%`);
    event.currentTarget.style.setProperty('--reveal-y', `${(1 - y) * 100}%`);

    if (pointerDown.current) {
      const movement = Math.hypot(
        event.clientX - pointerDown.current.x,
        event.clientY - pointerDown.current.y,
      );
      if (movement > 8) pointerDown.current.moved = true;
    }
  };

  const reveal = () => {
    interaction.current.targetProgress = 1;
    interaction.current.lastInteraction = performance.now();
    setRevealed(true);
  };

  const restore = () => {
    if (pointerDown.current || locked) return;
    interaction.current.targetProgress = 0;
    interaction.current.lastInteraction = performance.now();
    setRevealed(false);
  };

  const toggle = () => {
    const next = !locked;
    setLocked(next);
    interaction.current.targetProgress = next ? 1 : 0;
    interaction.current.lastInteraction = performance.now();
    setRevealed(next);
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      toggle();
      return;
    }

    const pointer = interaction.current.pointer;
    const movement = 0.08;
    if (event.key === 'ArrowLeft') pointer.x = Math.max(0, pointer.x - movement);
    else if (event.key === 'ArrowRight') pointer.x = Math.min(1, pointer.x + movement);
    else if (event.key === 'ArrowUp') pointer.y = Math.min(1, pointer.y + movement);
    else if (event.key === 'ArrowDown') pointer.y = Math.max(0, pointer.y - movement);
    else return;

    event.preventDefault();
    event.currentTarget.style.setProperty('--reveal-x', `${pointer.x * 100}%`);
    event.currentTarget.style.setProperty('--reveal-y', `${(1 - pointer.y) * 100}%`);
    interaction.current.targetProgress = 1;
    interaction.current.lastInteraction = performance.now();
    setLocked(true);
    setRevealed(true);
  };

  const useFallback = reducedMotion || webglAvailable === false;

  return (
    <div
      className={`water-ripple ${className}`}
      style={
        {
          '--secondary-display-scale': displaySecondaryScale,
          '--secondary-left': `${displaySecondaryLeft}%`,
          '--secondary-top': `${displaySecondaryTop}%`,
        } as React.CSSProperties
      }
      role="button"
      tabIndex={0}
      aria-label={
        locked ? 'Hide the original portrait reveal' : 'Reveal the original portrait locally'
      }
      aria-pressed={locked}
      onPointerEnter={(event) => {
        if (event.pointerType === 'mouse') reveal();
      }}
      onPointerMove={(event) => {
        updatePointer(event);
        if (event.pointerType === 'mouse') reveal();
      }}
      onPointerLeave={restore}
      onPointerDown={(event) => {
        pointerDown.current = { x: event.clientX, y: event.clientY, moved: false };
        updatePointer(event);
      }}
      onPointerUp={() => {
        if (pointerDown.current && !pointerDown.current.moved) toggle();
        pointerDown.current = null;
      }}
      onPointerCancel={() => {
        pointerDown.current = null;
      }}
      onKeyDown={onKeyDown}
    >
      <picture className="water-ripple-poster-picture">
        <source media="(max-width: 720px)" srcSet={mobilePrimaryImage} />
        <img
          className="water-ripple-poster"
          src={primaryImage}
          width={width}
          height={height}
          alt={primaryAlt}
          fetchPriority="high"
        />
      </picture>

      {useFallback ? (
        <div className={`water-static-toggle ${revealed ? 'is-revealed' : ''}`}>
          <picture>
            <source media="(max-width: 720px)" srcSet={mobileSecondaryImage} />
            <img src={secondaryImage} width={width} height={height} alt={secondaryAlt} />
          </picture>
        </div>
      ) : webglAvailable ? (
        <div className="water-canvas" aria-hidden="true">
          <Suspense fallback={null}>
            <Canvas
              frameloop="demand"
              orthographic
              camera={{ position: [0, 0, 1], zoom: 1 }}
              dpr={[1, 1.5]}
              gl={{ antialias: false, alpha: false, powerPreference: 'high-performance' }}
              onCreated={(state) => {
                const host = state.gl.domElement.parentElement;
                const rect = host?.getBoundingClientRect();
                if (rect && rect.width > 0 && rect.height > 0) {
                  state.setSize(rect.width, rect.height);
                  state.invalidate();
                }
              }}
            >
              <RipplePlane
                primaryImage={activePrimaryImage}
                secondaryImage={activeSecondaryImage}
                imageWidth={activeWidth}
                imageHeight={activeHeight}
                rippleStrength={rippleStrength}
                secondaryScale={activeSecondaryScale}
                secondaryOffset={activeSecondaryOffset}
                interaction={interaction}
              />
            </Canvas>
          </Suspense>
        </div>
      ) : null}

      <span className="sr-only">
        {primaryAlt}. Move the pointer to reveal the same area of the original photo. Tap or press
        Enter to lock the reveal; use the arrow keys to move it.
      </span>
    </div>
  );
}

import type { IUniform, Texture } from 'three';
import { ShaderMaterial, Vector2 } from 'three';
import fragmentShader from './shaders/waterRipple.frag.glsl?raw';
import vertexShader from './shaders/waterRipple.vert.glsl?raw';

export interface WaterRippleUniforms {
  uTexturePrimary: IUniform<Texture | null>;
  uTextureSecondary: IUniform<Texture | null>;
  uResolution: IUniform<Vector2>;
  uCoverScale: IUniform<Vector2>;
  uSecondaryScale: IUniform<Vector2>;
  uSecondaryOffset: IUniform<Vector2>;
  uPointer: IUniform<Vector2>;
  uPreviousPointer: IUniform<Vector2>;
  uTime: IUniform<number>;
  uPulseAge: IUniform<number>;
  uProgress: IUniform<number>;
  uPointerVelocity: IUniform<number>;
  uRippleStrength: IUniform<number>;
}

export type WaterRippleMaterial = ShaderMaterial & { uniforms: WaterRippleUniforms };

export function createWaterRippleMaterial(): WaterRippleMaterial {
  return new ShaderMaterial({
    vertexShader,
    fragmentShader,
    transparent: false,
    uniforms: {
      uTexturePrimary: { value: null },
      uTextureSecondary: { value: null },
      uResolution: { value: new Vector2(1, 1) },
      uCoverScale: { value: new Vector2(1, 1) },
      uSecondaryScale: { value: new Vector2(1, 1) },
      uSecondaryOffset: { value: new Vector2(0, 0) },
      uPointer: { value: new Vector2(0.5, 0.5) },
      uPreviousPointer: { value: new Vector2(0.5, 0.5) },
      uTime: { value: 0 },
      uPulseAge: { value: 10 },
      uProgress: { value: 0 },
      uPointerVelocity: { value: 0 },
      uRippleStrength: { value: 0.42 },
    },
  }) as WaterRippleMaterial;
}

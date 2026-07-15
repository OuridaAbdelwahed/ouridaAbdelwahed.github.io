precision highp float;

varying vec2 vUv;

uniform sampler2D uTexturePrimary;
uniform sampler2D uTextureSecondary;
uniform vec2 uResolution;
uniform vec2 uCoverScale;
uniform vec2 uSecondaryScale;
uniform vec2 uSecondaryOffset;
uniform vec2 uPointer;
uniform vec2 uPreviousPointer;
uniform float uTime;
uniform float uPulseAge;
uniform float uProgress;
uniform float uPointerVelocity;
uniform float uRippleStrength;

vec2 coverUv(vec2 uv) {
  return (uv - 0.5) * uCoverScale + 0.5;
}

void main() {
  float shortestSide = max(min(uResolution.x, uResolution.y), 1.0);
  vec2 aspect = uResolution / shortestSide;
  vec2 delta = (vUv - uPointer) * aspect;
  vec2 previousDelta = (vUv - uPreviousPointer) * aspect;
  float distanceToPointer = length(delta);
  float distanceToPrevious = length(previousDelta);

  float decay = exp(-uPulseAge * 2.35);
  float ring = sin(distanceToPointer * 64.0 - uPulseAge * 16.0);
  float trailingRing = sin(distanceToPrevious * 51.0 - uPulseAge * 12.0 + 0.8);
  float wave = (ring * exp(-distanceToPointer * 5.2) + trailingRing * exp(-distanceToPrevious * 6.0) * 0.46) * decay;

  vec2 direction = normalize(delta + vec2(0.0001));
  float velocityBoost = 1.0 + min(uPointerVelocity, 1.8) * 0.4;
  vec2 displacement = direction * wave * uRippleStrength * 0.020 * velocityBoost;
  vec2 waterDrift = vec2(
    sin((vUv.y + uTime * 0.055) * 28.0),
    cos((vUv.x - uTime * 0.045) * 31.0)
  ) * 0.0009 * uProgress;

  vec2 primaryUv = coverUv(vUv + displacement + waterDrift);
  vec2 secondaryUv = coverUv(vUv - displacement * 0.72 - waterDrift);
  secondaryUv = secondaryUv * uSecondaryScale + uSecondaryOffset;
  vec4 primary = texture2D(uTexturePrimary, primaryUv);
  vec4 secondary = texture2D(uTextureSecondary, secondaryUv);

  float idleRipple = sin(distanceToPointer * 54.0 - uTime * 7.0) * 0.006 * uProgress;
  float radius = mix(0.01, 0.14, smoothstep(0.0, 1.0, uProgress));
  float distortedDistance = distanceToPointer + wave * 0.024 + idleRipple;
  float reveal = 1.0 - smoothstep(radius - 0.026, radius + 0.032, distortedDistance);
  reveal *= smoothstep(0.0, 0.26, uProgress);
  float secondaryInBounds =
    step(0.0, secondaryUv.x) * step(secondaryUv.x, 1.0) *
    step(0.0, secondaryUv.y) * step(secondaryUv.y, 1.0);
  reveal *= secondaryInBounds;

  vec3 color = mix(primary.rgb, secondary.rgb, reveal);
  float edge = smoothstep(0.0, 0.055, abs(distortedDistance - radius));
  float highlight = max(wave, 0.0) * 0.11 * decay + (1.0 - edge) * uProgress * 0.035;
  color += vec3(0.26, 0.76, 0.92) * highlight;
  color *= 1.0 - min(abs(wave) * 0.045, 0.035);

  gl_FragColor = vec4(color, 1.0);
}

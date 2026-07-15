export interface CoverScale {
  x: number;
  y: number;
}

export function getCoverScale(
  containerWidth: number,
  containerHeight: number,
  imageWidth: number,
  imageHeight: number,
): CoverScale {
  const containerAspect = containerWidth / Math.max(containerHeight, 1);
  const imageAspect = imageWidth / Math.max(imageHeight, 1);

  return containerAspect > imageAspect
    ? { x: 1, y: imageAspect / containerAspect }
    : { x: containerAspect / imageAspect, y: 1 };
}

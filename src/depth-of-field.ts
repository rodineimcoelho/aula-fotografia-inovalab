export function defocusRadius(aperture: number, focusMeters: number, planeMeters: number, imageWidth: number): number {
  const focal = 85, focus = focusMeters*1000, plane = planeMeters*1000;
  const circle = focal*focal*Math.abs(plane-focus)/(aperture*plane*(focus-focal));
  return Math.min(imageWidth*.08,circle/36*imageWidth/2);
}

export const focusPlanes = { foreground: .85, subject: 1.8, background: 8 } as const;
export type FocusPlane = keyof typeof focusPlanes;

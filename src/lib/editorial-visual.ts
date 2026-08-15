const widths = [640, 960, 1440] as const;
const widthPresets = {
  wide: { breakpoint: 1168, width: 1120 },
  narrow: { breakpoint: 944, width: 896 },
  hero: { breakpoint: 800, width: 560 },
} as const;

function buildSrcset(slug: string, format: 'avif' | 'webp') {
  return widths
    .map((width) => `/images/editorial/${slug}-${width}.${format} ${width}w`)
    .join(', ');
}

export function getEditorialVisualSources(slug: string, widthPreset: keyof typeof widthPresets = 'wide') {
  const preset = widthPresets[widthPreset];

  return {
    avif: buildSrcset(slug, 'avif'),
    webp: buildSrcset(slug, 'webp'),
    fallback: `/images/editorial/${slug}-960.webp`,
    sizes: `(min-width: ${preset.breakpoint}px) ${preset.width}px, (min-width: 640px) calc(100vw - 3rem), calc(100vw - 2rem)`,
  };
}

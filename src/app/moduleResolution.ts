/**
 * 
 */
export function isServerSide(): boolean {
  try {
    // running on an express server during dev
    return global.process.title === 'node';
  } catch (_) {
    // running in a cloudflare worker in prod
    return !('Window' in self);
  }
}

/**
 * 
 */
export function getLocalComponent(name: string) {
  const { APP: { components } } = self as any;
  return components[name];
}

/**
 * 
 */
export function buildModuleUrl(name: string): string {
  const { APP: { manifest, gcs: { base } } } = self as any;
  const filename = manifest[`${name.toLowerCase()}.js`];
  // assets are local during dev
  if (process.env.NODE_ENV !== 'production') {
    return `/${filename}`;
  }
  // assets are stored on GCS in prod
  return `${base}/${filename}`;
}

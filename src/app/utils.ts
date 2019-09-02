import { AnyComponent } from 'preact';
import LolError from './components/LolError';

/**
 * 
 */
function getLocalComponent(name: string): AnyComponent {
  const { APP: { components } } = self as any;
  return components[name];
}

/**
 * 
 */
function buildModuleUrl(name: string): string {
  const { APP: { manifest, gcs: { base } } } = self as any;
  const filename = manifest[`${name.toLowerCase()}.js`];
  // assets are local during dev
  if (process.env.NODE_ENV !== 'production') {
    return `/${filename}`;
  }
  // assets are stored on GCS in prod
  return `${base}/${filename}`;
}

/**
 * 
 */
function isServerSide(): boolean {
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
export const moduleResolver = (name: string) => async (): Promise<AnyComponent> => {
  try {
    // modules available through global variables
    if (isServerSide()) {
      return Promise.resolve(getLocalComponent(name));
    }
    // fetch modules
    const module = await import(/* webpackIgnore: true */ buildModuleUrl(name));
    return module.default;
  } catch (err) {
    console.error(err);
    return Promise.resolve(LolError);
  }
};

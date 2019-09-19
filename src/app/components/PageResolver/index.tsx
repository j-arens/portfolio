import { h } from 'preact';
import { Suspense, lazy } from 'preact/compat';

type RouterProps = {
  path: string;
};

type OwnProps = {
  page: string;
};

type Props = RouterProps & OwnProps;

const importPage = (
  name: string,
): Promise<{ default: () => h.JSX.Element }> => {
  switch (name) {
    case 'Blog':
      return import(
        /* webpackChunkName: "blog", webpackPrefetch: true */ '../../pages/Blog'
      );
    case 'About':
      return import(
        /* webpackChunkName: "about", webpackPrefetch: true */ '../../pages/About'
      );
    case 'Contact':
      return import(
        /* webpackChunkName: "contact", webpackPrefetch: true */ '../../pages/Contact'
      );
    default: {
      return Promise.resolve({ default: () => <div /> }); // eslint-disable-line react/display-name
    }
  }
};

const PageResolver = ({ page }: Props): h.JSX.Element => {
  // @ts-ignore
  if (page in self.APP.components) {
    // @ts-ignore
    return h(self.APP.components[page], {});
  }
  return (
    <Suspense fallback={<div>lol suspense fallback</div>}>
      {h(lazy(() => importPage(page)), {})}
    </Suspense>
  );
};

export default PageResolver;

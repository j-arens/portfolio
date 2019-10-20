import { h, FunctionComponent } from 'preact';
import { Suspense, lazy } from 'preact/compat';
import { GLOBAL, Components } from '~common/type';

type RouterProps = {
  path: string;
};

type OwnProps = {
  page: keyof Components;
};

type Props = RouterProps & OwnProps;

const importPage = (name: string): Promise<{ default: FunctionComponent }> => {
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
      // @TODO: 404 component
      return Promise.resolve({ default: () => <div /> }); // eslint-disable-line react/display-name
    }
  }
};

const PageResolver: FunctionComponent<Props> = ({ page }: Props) => {
  const {
    APP: { components },
  } = self as GLOBAL;
  if (page in components) {
    return h(components[page], {});
  }
  return (
    <Suspense fallback={<div>lol suspense fallback</div>}>
      {h(lazy(() => importPage(page)), {})}
    </Suspense>
  );
};

export default PageResolver;

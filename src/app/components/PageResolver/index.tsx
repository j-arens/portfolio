import { h, FunctionComponent } from 'preact';
import { Suspense, lazy } from 'preact/compat';
import { GLOBAL, Components } from '~common/type';
import NotFound from '../NotFound';
import PageSpinner from '../PageSpinner';

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
    case 'Post':
      return import(
        /* webpackChunkName: "post", webpackPrefetch: true */ '../../pages/Post'
      );
    default: {
      return Promise.resolve({ default: NotFound });
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
    <Suspense fallback={<PageSpinner />}>
      {h(lazy(() => importPage(page)), {})}
    </Suspense>
  );
};

export default PageResolver;

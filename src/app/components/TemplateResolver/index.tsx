import { h } from 'preact';
import { Suspense, lazy } from 'preact/compat';

type RouterProps = {
  path: string;
};

type OwnProps = {
  template: string;
};

type Props = RouterProps & OwnProps;

const importTemplate = (
  name: string,
): Promise<{ default: () => h.JSX.Element }> => {
  switch (name) {
    case 'Blog':
      return import(
        /* webpackChunkName: "blog", webpackPrefetch: true */ '../../templates/Blog'
      );
    case 'About':
      return import(
        /* webpackChunkName: "about", webpackPrefetch: true */ '../../templates/About'
      );
    case 'Contact':
      return import(
        /* webpackChunkName: "contact", webpackPrefetch: true */ '../../templates/Contact'
      );
    default: {
      return Promise.resolve({ default: () => <div /> }); // eslint-disable-line react/display-name
    }
  }
};

const TemplateResolver = ({ template }: Props): h.JSX.Element => {
  // @ts-ignore
  if (template in self.APP.components) {
    // @ts-ignore
    return h(self.APP.components[template], {});
  }
  return (
    <Suspense fallback={<div>lol suspense fallback</div>}>
      {h(lazy(() => importTemplate(template)), {})}
    </Suspense>
  );
};

export default TemplateResolver;

import { h } from 'preact';
import { Suspense, lazy } from 'preact/compat';

type RouterProps = {
  path: string,
}

type OwnProps = {
  template: string,
}

type Props = RouterProps & OwnProps;

const importTemplate = (name: string) => {
  switch (name) {
    case 'Home':
      return import(/* webpackChunkName: "home", webpackPrefetch: true */'../../templates/Home');
    case 'About':
      return import(/* webpackChunkName: "about", webpackPrefetch: true */'../../templates/About');
    case 'Contact':
      return import(/* webpackChunkName: "contact", webpackPrefetch: true */'../../templates/Contact');
    default: {
      return Promise.resolve({ default: () => <div /> });
    }
  }
}

const TemplateResolver = ({ template }: Props) => {
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

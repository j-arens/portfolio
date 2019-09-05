import { h } from 'preact';
import { Suspense, lazy } from 'preact/compat';
// import { isServerSide, getLocalComponent } from '~app/moduleResolution';

type RouterProps = {
  path: string,
}

type OwnProps = {
  template: string,
}

type Props = RouterProps & OwnProps;

const importTemplate = (name: string) => {
  switch (name) {
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
  if (self.APP.isSSR) {
    // @ts-ignore
    return h(self.APP.components[template], {});
  }
  // @ts-ignore
  if (self.webpackJsonp) {
    // @ts-ignore
    console.log(self.webpackJsonp);
    // @ts-ignore
    const [_, module] = self.webpackJsonp.find(chunk => chunk[0][0] === template.toLowerCase()) || [];
    // console.log('MODULE: ', module);
    // @ts-ignore
    // Object.values(module)[0]();
    // return h(, {});
  }
  return (
    <Suspense fallback={<div>lol suspense fallback</div>}>
      {h(lazy(() => importTemplate(template)), {})}
    </Suspense>
  );
};

export default TemplateResolver;

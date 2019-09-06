import { h } from 'preact';
// import { Suspense, lazy } from 'preact/compat';
import { Suspense } from 'preact/compat/src/index';
// import { Suspense, lazy } from 'preact/compat/src/index';
// import { isServerSide, getLocalComponent } from '~app/moduleResolution';

type RouterProps = {
  path: string,
}

type OwnProps = {
  template: string,
}

type Props = RouterProps & OwnProps;

// const importTemplate = (name: string) => {
//   switch (name) {
//     case 'About':
//       return import(/* webpackChunkName: "about", webpackPrefetch: true */'../../templates/About');
//     case 'Contact':
//       return import(/* webpackChunkName: "contact", webpackPrefetch: true */'../../templates/Contact');
//     default: {
//       return Promise.resolve({ default: () => <div /> });
//     }
//   }
// }

// const importTemplate = (name: string) => {
//   // @ts-ignore
//   if (name in self.APP.components) {
//     // @ts-ignore
//     return Promise.resolve(self.APP.components[name]);
//   }
//   switch (name) {
//     case 'About': {   
//       return import(/* webpackChunkName: "about", webpackPrefetch: true */'../../templates/About');
//     }
//     case 'Contact': {
//       return import(/* webpackChunkName: "contact", webpackPrefetch: true */'../../templates/Contact');
//     }
//     default: {
//       return Promise.resolve({ default: () => <div /> });
//     }
//   }
// }

// const TemplateResolver = ({ template }: Props) => {
//   // @ts-ignore
//   if (template in self.APP.components) {
//     // @ts-ignore
//     return h(self.APP.components[template], {});
//   }
//   return (
//     <Suspense fallback={<div>lol suspense fallback</div>}>
//       {h(lazy(() => importTemplate(template)), {})}
//     </Suspense>
//   );
// };

// const TemplateResolver = ({ template }: Props) => {
//   return (
//     <Suspense fallback={<div>lol suspense fallback</div>}>
//       {h(lazy(() => importTemplate(template)), {})}
//     </Suspense>
//   );
// };

const TemplateResolver = ({ template }: Props) => {
  // return <div>{template}</div>;
  return <Suspense fallback={<div>fallback</div>}><div>{template}</div></Suspense>;
};

export default TemplateResolver;

// export default (props: Props) => {
//   // @ts-ignore
//   if (self.APP.isSSR) {

//   }
// };

// if (self.APP.isSSR) {
  // @ts-ignore
  // return h(self.APP.components[template], {});
// }

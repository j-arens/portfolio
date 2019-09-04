import { h } from 'preact';
import { Suspense, lazy } from 'preact/compat';
import { isServerSide, getLocalComponent } from '~app/moduleResolution';

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
      return import('../../templates/About');
    case 'Contact':
      return import('../../templates/Contact');
    default: {
      return Promise.resolve({ default: () => <div /> });
    }
  }
}

const TemplateResolver = ({ template }: Props) => {
  if (isServerSide()) {
    return h(getLocalComponent(template), {});
  }
  return (
    <Suspense fallback={<div>lol suspense fallback</div>}>
      {h(lazy(() => importTemplate(template)), {})}
    </Suspense>
  );
};

export default TemplateResolver;

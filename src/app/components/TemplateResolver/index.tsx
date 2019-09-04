import { h } from 'preact';
import { Suspense, lazy } from 'preact/compat';
import { isServerSide, getLocalComponent, buildModuleUrl } from '~app/moduleResolution';

type RouterProps = {
  path: string,
}

type OwnProps = {
  template: string,
}

type Props = RouterProps & OwnProps;

const TemplateResolver = ({ template }: Props) => {
  if (isServerSide()) {
    return h(getLocalComponent(template), {});
  }
  const url = buildModuleUrl(template);
  return (
    <Suspense fallback={<div>lol suspense fallback</div>}>
      {h(lazy(() => import(/* webpackIgnore: true */`${url}`)), {})}
    </Suspense>
  );
};

export default TemplateResolver;

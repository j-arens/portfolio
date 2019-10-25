import { h, FunctionComponent, ComponentChildren } from 'preact';
import {
  Router as PreactRouter,
  RouterProps,
  CustomHistory,
} from 'preact-router';
import { GLOBAL } from '~common/type';

type Props = RouterProps & {
  children: ComponentChildren[];
};

const Router: FunctionComponent<Props> = (props: Props) => {
  const {
    APP: { ssr },
  } = self as GLOBAL;
  // preact-router wasn't really intended to work server side
  // need to mock the location and pathname to get things working
  // @see https://github.com/preactjs/preact-router/issues/213
  if (ssr) {
    const history = {
      location: {
        pathname: props.url,
      },
    };
    return (
      <PreactRouter {...props} history={history as CustomHistory}>
        {props.children}
      </PreactRouter>
    );
  }
  return <PreactRouter {...props}>{props.children}</PreactRouter>;
};

export default Router;

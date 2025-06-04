import { RouteComponentProps } from '@reach/router';
import ErrorPageTemplate from '../ErrorPageTemplate';

const StimNotFoundPage = (props: RouteComponentProps) => {
  return (
    <ErrorPageTemplate
      title="404! Page not found"
      message="Click here to go back to the home page or wait five seconds"
      {...props}
    />
  );
};

export default StimNotFoundPage;

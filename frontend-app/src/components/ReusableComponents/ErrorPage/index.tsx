import { RouteComponentProps } from '@reach/router';
import ErrorPageTemplate from '../ErrorPageTemplate';

const StimErrorPage = (props: RouteComponentProps) => {
  return (
    <ErrorPageTemplate
      title="Error"
      message="There was an unexpected error, please try again. Click here to go back to the home page or wait five seconds"
      {...props}
    />
  );
};

export default StimErrorPage;

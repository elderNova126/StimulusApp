import { Box } from '@chakra-ui/layout';
import { RouteComponentProps } from '@reach/router';
import { useEffect } from 'react';

const CompaniesLayout = (props: RouteComponentProps & { children: any }) => {
  useEffect(() => {
    const pathname = props.location?.pathname ?? '';
    const match = pathname.match(
      /\/companies\/(all|favorites|internal|lists)\/?[0-9]*\/(list|map|compare)\/?[0-9]*\/?/g
    );

    if (!match || match[0] !== pathname) {
      props?.navigate?.('all/list/1');
    }
  }, [props]);

  return <Box p="76px 0 0 52px">{props.children}</Box>;
};

export default CompaniesLayout;

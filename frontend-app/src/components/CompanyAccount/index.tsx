import { Box, BoxProps, Flex, Stack, Text, List, ListItem } from '@chakra-ui/layout';
import { Spinner } from '@chakra-ui/react';
import { navigate, RouteComponentProps } from '@reach/router';
import { FC, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { TenantCompanyContext } from '../../context/TenantCompany';
import { FakeRightBorder } from '../Company/shared';
import { CompanyAvatar } from '../GenericComponents';
import { useSelector } from 'react-redux';
const CompanyAccountLayout: FC<RouteComponentProps> = (props) => {
  const loadingLogo = useSelector((state: any) => state.generalData.loadingLogo.company);
  const { tenantCompany } = useContext(TenantCompanyContext);
  const { t } = useTranslation();
  const companyId = tenantCompany?.id;

  return (
    <Flex>
      <Box w="300px" h="100vh" position="relative" p="3rem 0 0 1.5rem">
        <FakeRightBorder />
        <Flex alignItems="center">
          {loadingLogo ? (
            <Spinner color="#15844b" borderRadius={'50%'} width="65px" height="40px" />
          ) : (
            <>{companyId && <CompanyAvatar border="1px solid gray" companyId={companyId} bg="#D4D4D4" />}</>
          )}
          <Text as="h2" textStyle="h2" pl="2">
            {tenantCompany?.legalBusinessName}
          </Text>
        </Flex>
        <Stack p="1.2rem 0 0 1.2rem">
          <MenuItem label={t('Account')} onClick={() => navigate('/account')} />
          <Stack>
            <MenuItem label={t('Settings')} />
            <List pl="20px">
              <ListItem>
                <MenuItem label={t('Badges')} onClick={() => navigate('/account/settings/badges')} />
              </ListItem>
            </List>
          </Stack>
          <MenuItem label={t('User Management')} onClick={() => navigate('/account/usermanagement')} />
          <MenuItem label={t('Data Sources')} onClick={() => navigate('/account/datasources#')} />
          <MenuItem label={t('Activity Log')} onClick={() => navigate('/account/activitylog')} />
        </Stack>
      </Box>
      <Box w="100%" p="7rem 2rem 0 4rem">
        {props.children}
      </Box>
    </Flex>
  );
};

const MenuItem: FC<BoxProps & { label: string | FC }> = (props) => {
  const { label, ...boxProps } = props;

  return (
    <Box
      _hover={{ bg: 'menu.company_category' }}
      p="8px 16px"
      cursor="pointer"
      borderRadius="28px 0px 0px 28px"
      {...boxProps}
    >
      {label}
    </Box>
  );
};
export default CompanyAccountLayout;

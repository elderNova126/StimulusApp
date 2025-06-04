import { Box, Flex, Stack, Text } from '@chakra-ui/layout';
import { BoxProps } from '@material-ui/core';
import { navigate, RouteComponentProps } from '@reach/router';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useUser } from '../../hooks';
import { FakeRightBorder } from '../Company/shared';
import { UserAvatar } from '../GenericComponents';
import { Spinner } from '@chakra-ui/spinner';
import { useSelector } from 'react-redux';

const MyAccountLyout: FC<RouteComponentProps> = (props) => {
  const loadingLogo = useSelector((state: any) => state.generalData.loadingLogo.user);
  const {
    user: { given_name, family_name, sub },
  } = useUser();
  const { t } = useTranslation();
  const userName = `${given_name ?? ''} ${family_name ?? ''}`.trim() || t('My Profile');
  const userId = sub;

  return (
    <Flex>
      <Box w="300px" h="100vh" position="relative" p="3rem 0 0 1.5rem">
        <FakeRightBorder />
        <Flex alignItems="center">
          {loadingLogo ? (
            <Spinner color="#15844b" borderRadius={'50%'} width="40px" height="40px" />
          ) : (
            <> {userId && <UserAvatar userId={userId} />}</>
          )}

          <Text as="h2" textStyle="h2" pl="2">
            {userName}
          </Text>
        </Flex>
        <Stack p="1.2rem 0 0 1.2rem">
          <MenuItem label={t('Account')} onClick={() => navigate('/user/account')} />
          <MenuItem label={t('Profile')} onClick={() => navigate('/user/account/profile')} />
          {/* Swich to settings tab on profile view*/}
          {/* <MenuItem label={t('Settings')} onClick={() => navigate('/user/account/settings')} /> */}
          <MenuItem label={t('Activity Log')} onClick={() => navigate('/user/account/myactivitylog')} />
        </Stack>
      </Box>
      <Box w="100%" p="7rem 0 0 4rem">
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
export default MyAccountLyout;

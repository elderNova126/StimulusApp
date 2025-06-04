import { useLazyQuery, useMutation } from '@apollo/client';
import { Radio, RadioGroup } from '@chakra-ui/radio';
import {
  AvatarGroup,
  Box,
  BoxProps,
  Center,
  CircularProgress,
  Collapse,
  Divider,
  Flex,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Portal,
  Stack,
  Text,
  Spinner,
} from '@chakra-ui/react';
import { navigate } from '@reach/router';
import React, { FC, useContext, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { MdSettings } from 'react-icons/md';
import { useSelector, useDispatch } from 'react-redux';
import { AuthContext } from '../../context/Auth';
import { LocalStorageContext } from '../../context/LocalStorage';
import { TenantCompanyContext } from '../../context/TenantCompany';
import OtherMutations from '../../graphql/Mutations/OtherMutations';
import UserQueries from '../../graphql/Queries/UserQueries';
import { useTenantCompany, useUser } from '../../hooks';
import { CompanyUpdateState } from '../../stores/features/company';
import { CompanyAvatar, Dialog, UserAvatar } from '../GenericComponents';
import { setTenantName } from '../../stores/features/generalData';
import LoadingSkeletonList from '../LoadingSkeletonList';
import { withLDConsumer } from 'launchdarkly-react-client-sdk';
import StimButton from '../ReusableComponents/Button';
const { USER_TENANTS } = UserQueries;
const { ISSUE_CONTEXT_TOKEN_GQL } = OtherMutations;
const MenuBar = () => {
  const { t } = useTranslation();
  const {
    user: { sub: currentUserId, given_name, family_name },
  } = useUser();
  const { tenantCompany } = useContext(TenantCompanyContext);
  const [isOpenUserMenu, setIsOpenUserMenu] = React.useState(false);
  const [isOpenCompanyMenu, setIsOpenCompanyMenu] = React.useState(false);
  const [isOpenSwitchCompanyMenu, setIsOpenSwitchCompanyMenu] = React.useState(false);
  const openUserMenu = () => setIsOpenUserMenu(true);
  const closeUserMenu = () => setIsOpenUserMenu(false);
  const openCompanyMenu = () => setIsOpenCompanyMenu(true);
  const closeCompanyMenu = () => setIsOpenCompanyMenu(false);
  const openSwitchCompanyMenu = () => setIsOpenSwitchCompanyMenu(true);
  const closeSwitchCompanyMenu = () => setIsOpenSwitchCompanyMenu(false);
  const loadingLogoCompany = useSelector((state: any) => state.generalData.loadingLogo.company);
  const loadingLogoUser = useSelector((state: any) => state.generalData.loadingLogo.user);
  const companyEdit = useSelector((state: { company: CompanyUpdateState }) => state.company?.edit);

  const companyId = tenantCompany?.id;
  const userName = `${given_name ?? ''} ${family_name ?? ''}`.trim() || t('My Profile');

  return (
    <Box position="fixed" zIndex="overlay" top="1.5rem" right="2.5rem" visibility={companyEdit ? 'hidden' : 'visible'}>
      <Flex>
        <Box cursor="pointer" onClick={openCompanyMenu} border="1px solid #D4D4D4" borderRadius="4px" p="8px" mr="1">
          <MdSettings />
          <CompanyMenu open={isOpenCompanyMenu} onClose={closeCompanyMenu} loadingLogo={loadingLogoCompany} />
        </Box>
        <AvatarGroup size="sm" cursor="pointer">
          {loadingLogoUser ? (
            <Spinner color="#15844b" borderRadius={'50%'} width="25px" height="25px" bg="white" />
          ) : (
            currentUserId && (
              <UserAvatar
                id="user-avatar-menu"
                userId={currentUserId}
                {...(isOpenUserMenu && { borderColor: '#B0E2BB' })}
                onClick={openUserMenu}
              />
            )
          )}

          {loadingLogoCompany ? (
            <Spinner color="#15844b" borderRadius={'50%'} width="25px" height="25px" />
          ) : (
            <>
              {companyId && (
                <CompanyAvatar bg="#D4D4D4" w="29px" h="29px" companyId={companyId} onClick={openSwitchCompanyMenu} />
              )}
            </>
          )}
        </AvatarGroup>
      </Flex>
      <UserMenu
        userId={currentUserId}
        userName={userName}
        open={isOpenUserMenu}
        onClose={closeUserMenu}
        loadingLogo={loadingLogoUser}
      />
      <SwitchCompanyMenu open={isOpenSwitchCompanyMenu} onClose={closeSwitchCompanyMenu} />
    </Box>
  );
};

const CompanyMenu: FC<{ open: boolean; onClose: () => void; loadingLogo: boolean }> = ({
  open,
  onClose,
  loadingLogo,
}) => {
  const { tenantCompany } = useContext(TenantCompanyContext);
  const { t } = useTranslation();
  const tenantId = tenantCompany?.id;
  return (
    <Popover returnFocusOnClose={false} isOpen={open} onClose={onClose} placement="left" closeOnBlur={true}>
      <PopoverTrigger>
        <Box visibility="hidden" />
      </PopoverTrigger>
      <PopoverContent
        onClick={(e) => e.stopPropagation()}
        maxH="500px"
        overflowY="scroll"
        p="0"
        width="200px"
        mt="40px"
        borderRadius="0"
        border="1px solid #E4E4E4"
        borderColor="#E4E4E4"
        boxShadow="0px 1px 2px rgba(0, 0, 0, 0.25) !important"
      >
        <PopoverBody p="0">
          <Stack spacing={0}>
            <MenuItem
              defaultOpen={true}
              p="10px 0"
              type="expand"
              label={
                <>
                  {loadingLogo ? (
                    <Spinner color="#15844b" borderRadius={'50%'} width="80px" height="40px" />
                  ) : (
                    <>
                      <CompanyAvatar companyId={tenantId ?? 'Company'} bg="#D4D4D4" border="1px solid gray" />
                    </>
                  )}

                  <Stack pl="4" spacing={0}>
                    <Text as="h4" textStyle="h4">
                      {tenantCompany?.legalBusinessName}
                    </Text>
                    <Text
                      as="h4"
                      textStyle="miniTextLink"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/company/${tenantCompany.id}`);
                      }}
                    >
                      {t('View Company Profile')}
                    </Text>
                  </Stack>
                </>
              }
            >
              <Stack spacing={2} pl="30px" pt="10px">
                <MenuItem
                  type="link"
                  onClick={() => navigate('/account')}
                  label={
                    <Text as="h4" textStyle="h4">
                      {t('Account')}
                    </Text>
                  }
                />
                <MenuItem
                  type="expand"
                  label={
                    <Text as="h4" textStyle="h4">
                      {t('Settings')}
                    </Text>
                  }
                >
                  <MenuItem
                    type="link"
                    onClick={() => navigate('/account/settings/badges')}
                    label={
                      <Text as="h5" textStyle="h5" pl="15px">
                        {t('Badges')}
                      </Text>
                    }
                  />
                </MenuItem>
                <MenuItem
                  type="link"
                  onClick={() => navigate('/account/usermanagement')}
                  label={
                    <Text as="h4" textStyle="h4">
                      {t('User Management')}
                    </Text>
                  }
                />
                <MenuItem
                  type="link"
                  onClick={() => navigate('/account/datasources')}
                  label={
                    <Text as="h4" textStyle="h4">
                      {t('Data Sources')}
                    </Text>
                  }
                />
                <MenuItem
                  type="link"
                  onClick={() => navigate('/account/activitylog')}
                  label={
                    <Text as="h4" textStyle="h4">
                      {t('Activity Log')}
                    </Text>
                  }
                />
              </Stack>
            </MenuItem>
          </Stack>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};

const SwitchCompanyMenu: FC<{ open: boolean; onClose: () => void }> = ({ open, onClose }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { tenantId: currentTenantId }: any = useTenantCompany();
  const [getTenant, { data, loading: loadingTenants, client }] = useLazyQuery(USER_TENANTS(), {
    fetchPolicy: 'cache-first',
  });
  const tenants = data?.userTenants?.filter?.((tenant: any) => tenant.provisionStatus === 'provisioned') || [];
  const { setTenantToken } = useContext(LocalStorageContext);
  dispatch(setTenantName(tenants.find((tenant: any) => tenant.id === currentTenantId)?.name));
  const [issueContextToken, { loading: switchTenantLoading }] = useMutation(ISSUE_CONTEXT_TOKEN_GQL, {
    update: (
      cache,
      {
        data: {
          issueContextToken: { token },
        },
      }
    ) => {
      setTenantToken(token);
      client?.resetStore();
      // temporary solution ticket 357
      window.location.reload();
      localStorage.removeItem('apollo-cache-persist');
    },
  });

  useEffect(() => {
    if (open) {
      getTenant();
    }
  }, [open]);

  return (
    <Popover returnFocusOnClose={false} isOpen={open} onClose={onClose} isLazy placement="bottom-start">
      <PopoverTrigger>
        <Box visibility="hidden" />
      </PopoverTrigger>
      <Portal>
        <PopoverContent
          onClick={(e) => e.stopPropagation()}
          maxH="500px"
          overflowY="scroll"
          p="0"
          width="210px"
          borderRadius="0"
          border="1px solid #E4E4E4"
          borderColor="#E4E4E4"
          boxShadow="0px 1px 2px rgba(0, 0, 0, 0.25) !important"
        >
          <PopoverBody p="20px">
            <Stack direction="row" spacing={2} pb="3">
              <Text as="h4" textStyle="h4">
                {t('Switch Company')}
              </Text>
              <Box visibility={switchTenantLoading ? 'visible' : 'hidden'}>
                <CircularProgress size="20px" isIndeterminate color="green.300" />
              </Box>
            </Stack>
            <RadioGroup
              onChange={(value: string) => {
                !switchTenantLoading && issueContextToken({ variables: { tenantId: value } });
              }}
              colorScheme="blackAlpha"
              value={currentTenantId ?? ''}
            >
              <Stack>
                {loadingTenants ? (
                  <LoadingSkeletonList />
                ) : (
                  <>
                    {tenants.map((tenant: any) => (
                      <Radio key={tenant.id} value={tenant.id}>
                        <Text textStyle="body" data-cy={tenant.name}>
                          {tenant.name}
                        </Text>
                      </Radio>
                    ))}
                  </>
                )}
              </Stack>
            </RadioGroup>
          </PopoverBody>
        </PopoverContent>
      </Portal>
    </Popover>
  );
};
const UserMenu: FC<{
  open: boolean;
  onClose: () => void;
  userId: string;
  userName: string;
  loadingLogo: boolean;
}> = ({ open, onClose, userId, userName, loadingLogo }) => {
  const { t } = useTranslation();
  const [showLogoutPopup, setShowLogoutPopup] = React.useState(false);

  return (
    <>
      <Popover returnFocusOnClose={false} isOpen={open} onClose={onClose} isLazy placement="bottom-start">
        <PopoverTrigger>
          <Box visibility="hidden" />
        </PopoverTrigger>
        <Portal>
          <PopoverContent
            onClick={(e) => e.stopPropagation()}
            maxH="500px"
            overflowY="scroll"
            p="0"
            width="200px"
            borderRadius="0"
            border="1px solid #E4E4E4"
            borderColor="#E4E4E4"
            boxShadow="0px 1px 2px rgba(0, 0, 0, 0.25) !important"
          >
            <PopoverBody p="0">
              <Stack spacing={0}>
                <MenuItem
                  defaultOpen={true}
                  p="4px 0"
                  type="expand"
                  label={
                    <>
                      {loadingLogo ? (
                        <Spinner color="#15844b" borderRadius={'50%'} width="80px" height="40px" />
                      ) : (
                        <>
                          <UserAvatar userId={userId} size="2xs" />
                        </>
                      )}

                      <Text pl="2" as="h4" textStyle="h4">
                        {userName}
                      </Text>
                    </>
                  }
                >
                  <Box pl="6">
                    <MenuItem
                      type="link"
                      onClick={() => navigate('/user/account')}
                      label={
                        <Text as="h4" textStyle="h4">
                          {t('Account')}
                        </Text>
                      }
                    />
                    <MenuItem
                      type="link"
                      onClick={() => navigate('/user/account/profile')}
                      label={
                        <Text as="h4" textStyle="h4">
                          {t('Profile')}
                        </Text>
                      }
                    />
                    {/* Navigate to settings tab on layaout popover*/}
                    {/* <MenuItem
                      type="link"
                      onClick={() => navigate('/user/account/settings')}
                      label={
                        <Text as="h4" textStyle="h4">
                          {t('Settings')}
                        </Text>
                      }
                    /> */}
                    <MenuItem
                      type="link"
                      onClick={() => navigate('/user/account/myactivitylog')}
                      label={
                        <Text as="h4" textStyle="h4">
                          {t('Activity Log')}
                        </Text>
                      }
                    />
                  </Box>
                </MenuItem>
                <Center>
                  {' '}
                  <Divider borderColor="#D5D5D5" width="80%" />
                </Center>
                <MenuItem
                  type="link"
                  onClick={() =>
                    window.open(
                      'https://getstimulus.io/wp-content/uploads/2023/02/Stimulus-User-Guide-August-2022.pdf',
                      '_blank'
                    )
                  }
                  p="4px 0"
                  label={
                    <Text as="h4" textStyle="h4">
                      {t('Help')}
                    </Text>
                  }
                />
                <MenuItem
                  type="link"
                  p="4px 0"
                  onClick={() => navigate('/tenant/settings/apikeys')}
                  label={
                    <Text as="h4" textStyle="h4">
                      {t('Manager API keys')}
                    </Text>
                  }
                />
                <Center>
                  {' '}
                  <Divider borderColor="#D5D5D5" width="80%" />
                </Center>
                <MenuItem
                  p="4px 0"
                  type="link"
                  onClick={() => setShowLogoutPopup(true)}
                  id="logout-option"
                  label={
                    <Text as="h4" textStyle="h4">
                      {t('Log out')}
                    </Text>
                  }
                />
              </Stack>
            </PopoverBody>
          </PopoverContent>
        </Portal>
      </Popover>
      <LogOutDialog isOpen={showLogoutPopup} setIsOpen={setShowLogoutPopup} />
    </>
  );
};

const LogOutDialog = (props: { isOpen: boolean; setIsOpen: (val: boolean) => void }) => {
  const { isOpen, setIsOpen } = props;
  const { logout } = useContext(AuthContext);
  const { t } = useTranslation();

  return (
    <Dialog
      actions={
        <>
          <StimButton variant="stimOutline" size="stimSmall" onClick={() => setIsOpen(false)}>
            {t('Close')}
          </StimButton>
          <StimButton
            variant="stimDestructive"
            size="stimSmall"
            onClick={() => {
              localStorage.removeItem('lastLoginDate');
              return logout();
            }}
            paddingLeft="0px"
            id="logout-button"
            ml="1rem"
          >
            {t('Log out')}
          </StimButton>
        </>
      }
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
    >
      <Text p="5px" w="100%">
        {t('Are you sure you want to log out from this device?')}
      </Text>
    </Dialog>
  );
};

interface MenuItemProps {
  type: 'expand' | 'link';
  onClick?: () => void;
  label: JSX.Element;
  defaultOpen?: boolean;
}

const MenuItem: FC<BoxProps & MenuItemProps> = ({ type, onClick, label, children, defaultOpen, ...boxProps }) => {
  const [isOpen, setIsOpen] = React.useState(defaultOpen ?? false);

  const handleOnClick = () => {
    if (type === 'link' && onClick) {
      onClick();
    } else if (type === 'expand') {
      setIsOpen(!isOpen);
    }
  };

  return (
    <Box {...boxProps}>
      <Flex alignItems="center" cursor="pointer" p="1" pl="5" _hover={{ bg: '#F6F6F6' }} onClick={handleOnClick}>
        {label}
      </Flex>
      <Collapse in={isOpen} animateOpacity>
        {children}
      </Collapse>
    </Box>
  );
};

export default withLDConsumer()(MenuBar);

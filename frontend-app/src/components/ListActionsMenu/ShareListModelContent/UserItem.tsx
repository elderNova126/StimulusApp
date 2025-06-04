import { Box, Center, Flex } from '@chakra-ui/react';
import { User } from '../../../graphql/types';
import { capitalizeFirstLetter } from '../../../utils/dataMapper';
import { UserAvatar } from '../../GenericComponents';
import useStyles from './styles';
import { useTranslation } from 'react-i18next';
import StimButton from '../../ReusableComponents/Button';
export interface IUserItem {
  user: User;
  onShare: (user: string) => void;
  isCreator?: boolean;
  loading?: boolean;
}

const UserItem = (props: IUserItem) => {
  const { user, onShare, isCreator, loading } = props;
  const classes = useStyles();
  const { t } = useTranslation();
  return (
    <Flex className={classes.collaborator} marginTop={'5'} justifyContent="space-between">
      <Flex w="70%" h="40px">
        {user && (
          <Center>
            <UserAvatar userId={user.id} name={`${user?.givenName} ${user?.surname}`} />
            <Box as="span" m="5">
              <Box fontWeight="600" fontSize="14px">
                {capitalizeFirstLetter(user?.givenName as string)} {capitalizeFirstLetter(user?.surname as string)}
              </Box>
              <Box fontSize="xs" color="#666">
                {user?.email}
              </Box>
            </Box>
          </Center>
        )}
      </Flex>
      <Flex h="40px">
        {isCreator ? (
          <Center>
            <Box className={classes.creatoreLabel} m="5" fontWeight="600" fontSize="14px">
              Creator
            </Box>
          </Center>
        ) : (
          <Center>
            <Box m="5" fontWeight="600" fontSize="14px">
              <StimButton
                isLoading={loading}
                variant="stimTextButton"
                size="stimSmall"
                onClick={() => onShare(user.id)}
              >
                {t('Share')}
              </StimButton>
            </Box>
          </Center>
        )}
      </Flex>
    </Flex>
  );
};

export default UserItem;

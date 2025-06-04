import { Box, Center, Flex, Text } from '@chakra-ui/react';
import { ISharedListCollaborator, SharedListStatus } from '../../../graphql/Models/SharedList';
import { useUser } from '../../../hooks';
import { UserAvatar } from '../../GenericComponents';
import useStyles from './styles';
import StimButton from '../../ReusableComponents/Button';

export interface IUserItem {
  collaborator: ISharedListCollaborator;
  loading?: boolean;
  onRemove: () => void;
}

const CollaboratorItem = (props: IUserItem) => {
  const { collaborator, loading, onRemove } = props;
  const isVisible =
    collaborator.status !== SharedListStatus.DECLINED && collaborator.status !== SharedListStatus.DELETED;
  const classes = useStyles();
  const {
    user: { sub },
  } = useUser();
  return (
    <>
      {isVisible && (
        <Flex className={classes.collaborator} marginTop={'5'} justifyContent="space-between">
          <Flex w="60%" maxH="70px">
            {collaborator && (
              <Center>
                <UserAvatar userId={collaborator?.id} name={`${collaborator?.givenName} ${collaborator?.surname}`} />
                <Box m="5" fontWeight="600" fontSize="14px">
                  {collaborator?.givenName} {collaborator?.surname} <br />
                  <Text fontSize="xs" fontWeight="normal">
                    {collaborator?.status === SharedListStatus.PENDING && collaborator?.status}
                  </Text>
                </Box>
              </Center>
            )}
          </Flex>
          {sub !== collaborator?.id && (
            <Flex h="40px" mt="10px">
              <Center>
                <Box m="5" fontWeight="600" fontSize="14px">
                  <StimButton isLoading={loading} variant="stimTextButton" size="stimSmall" onClick={() => onRemove()}>
                    Remove
                  </StimButton>
                </Box>
              </Center>
            </Flex>
          )}
        </Flex>
      )}
    </>
  );
};
export default CollaboratorItem;

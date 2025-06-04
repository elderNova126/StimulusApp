import { useQuery } from '@apollo/client';
import { Box, Flex, Text } from '@chakra-ui/react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import UserQueries from '../../graphql/Queries/UserQueries';
import { User } from '../../graphql/types';
import { UserAvatar } from '../GenericComponents';
import ProjectPeopleInviteModal from './ProjectPeopleInviteModal';
import LoadingScreen from '../LoadingScreen';
import StimButton from '../ReusableComponents/Button';

export interface CollaborationUser extends User {
  collaborationId: string;
  collaborationType: string;
}

const { USER_PROFILE_GQL } = UserQueries;

const ProjectPeopleTab = (props: {
  projectId: number;
  collaborators: CollaborationUser[];
  pendingCollaborators: CollaborationUser[];
  loading: boolean;
}) => {
  const { loading: loadingUserProfile, data } = useQuery(USER_PROFILE_GQL, { fetchPolicy: 'cache-first' });
  const { projectId, collaborators, pendingCollaborators, loading } = props;
  const [inviteModalOpen, setInviteModalOpen] = useState<boolean>(false);
  const { t } = useTranslation();

  return (
    <Box pr="8rem">
      {loading || loadingUserProfile ? (
        <LoadingScreen />
      ) : (
        collaborators?.map((collaborator) => (
          <Flex marginTop="2.5rem" key={collaborator.id} flexDirection="row" mb="1.5rem">
            <Box margin="2px 0px 0px 20px">
              <UserAvatar size="xs" userId={collaborator.id} />
            </Box>
            <Flex flexDirection="column" ml="1rem">
              <Text marginBottom=".5rem" fontSize={18}>
                {collaborator.id === data?.userProfile?.id
                  ? 'You'
                  : `${collaborator?.givenName ?? ''} ${collaborator?.surname ?? ''}`}
              </Text>
              <Flex flexDirection="row">
                <Text as="sub" textStyle="subtitle2">
                  {t('Partner')}
                </Text>
                <span
                  style={{
                    position: 'relative',
                    top: '-9px',
                    margin: '0 0.3rem 0rem 0.3rem',
                  }}
                >
                  &#8729;
                </span>
                <Text as="sub" textStyle="subtitle2">{`${t('Project')} ${collaborator.collaborationType}`}</Text>
              </Flex>
            </Flex>
          </Flex>
        ))
      )}
      <Box margin="2rem 0 2rem">
        <StimButton id="project-people-button-000" onClick={() => setInviteModalOpen(true)} size="stimSmall">
          {t('Invite User')}
        </StimButton>
      </Box>

      <ProjectPeopleInviteModal
        isOpen={inviteModalOpen}
        invitedUsers={[...collaborators, ...pendingCollaborators]}
        onClose={() => setInviteModalOpen(false)}
        projectId={projectId}
      />
    </Box>
  );
};

export default ProjectPeopleTab;

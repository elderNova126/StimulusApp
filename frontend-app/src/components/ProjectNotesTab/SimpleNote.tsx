import { useQuery } from '@apollo/client';
import { Box, Flex, IconButton, Image, Spinner, Text } from '@chakra-ui/react';
import { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import UserQueries from '../../graphql/Queries/UserQueries';
import { utcStringToLocalDateTime } from '../../utils/date';
import { UserAvatar } from '../GenericComponents';
import ProjectNotesForm from './ProjectNotesForm';

interface Note {
  body: string;
  createdBy: string;
  created: string;
  id: number;
}

interface CurrentNote {
  id: number;
  type: string;
}

interface Props {
  note: Note;
  editable?: boolean;
  canReply?: boolean;
  onDelete?: (idToDelete: number) => void;
  currentNote?: CurrentNote | null;
  setCurrentNote?: (data: CurrentNote) => void;
  onSubmitEdit?: (id: number, body: string) => void;
  projectId: number;
  isReply?: boolean;
}

const { USER_PROFILE_GQL } = UserQueries;

const SimpleNote: FC<Props> = ({
  note,
  editable,
  canReply,
  onDelete,
  currentNote,
  setCurrentNote,
  projectId,
  isReply,
}) => {
  const { t } = useTranslation();
  const { body, createdBy, created } = note;
  const [edit, setEdit] = useState(false);
  const [reply, setReply] = useState(false);
  const { loading: loadingUser, data: userData } = useQuery(USER_PROFILE_GQL, {
    variables: { externalAuthSystemId: note.createdBy },
    fetchPolicy: 'cache-first',
  });
  const user = userData?.userProfile;

  const handleToggleReply = (e: any) => {
    e.preventDefault();
    if (!reply) {
      setCurrentNote?.({ type: 'reply', id: note.id });
    }
    setReply(!reply);
  };

  const handleToggleEdit = (e: any) => {
    e.preventDefault();
    if (!edit) {
      setCurrentNote?.({ type: 'edit', id: note.id });
    }
    setEdit(!edit);
  };

  return (
    <Flex marginLeft={isReply ? '3.5rem' : ''} flexDirection="row" mb="1.5rem">
      {edit ? (
        <Box width="450px">
          <ProjectNotesForm
            parentNoteId={isReply ? note.id : undefined}
            onClose={() => setEdit(false)}
            projectId={projectId}
            noteId={note.id}
            isEdit={true}
            title={t('Edit')}
            formBody={body}
            isCancelAvailable={true}
          />
        </Box>
      ) : (
        <>
          <UserAvatar userId={createdBy} />
          <Flex flexDirection="column" ml="1rem">
            <Box width="459px" borderRadius="20px" backgroundColor="green.100" padding="15px">
              {loadingUser ? (
                <Spinner />
              ) : (
                <Text marginBottom=".5rem" fontSize={12} fontWeight="bold">
                  {`${user?.givenName ?? ''} ${user?.surname ?? ''}`}
                </Text>
              )}
              <Text textStyle="body">{body}</Text>
            </Box>
            <Flex flexDirection="row">
              <Text marginTop=".7rem" marginLeft="1rem" fontSize={12}>
                {utcStringToLocalDateTime(created) || ''}
              </Text>
              <Box marginTop="4px">
                {canReply && (
                  <IconButton
                    onClick={handleToggleReply}
                    marginLeft="5px"
                    size="sm"
                    variant="simple"
                    aria-label="add"
                    icon={<Image width="15px" src="/icons/note_reply.svg" />}
                  />
                )}
                {editable && (
                  <>
                    <IconButton
                      onClick={handleToggleEdit}
                      size="sm"
                      position="relative"
                      left="-4px"
                      variant="simple"
                      aria-label="add"
                      icon={<Image width="15px" src="/icons/note_edit.svg" />}
                    />
                    <IconButton
                      position="relative"
                      left="-12px"
                      size="sm"
                      variant="simple"
                      aria-label="add"
                      onClick={(e) => {
                        if (onDelete) {
                          e.preventDefault();
                          onDelete(note.id);
                        }
                      }}
                      icon={<Image width="15px" src="/icons/note_delete.svg" />}
                    />
                  </>
                )}
              </Box>
            </Flex>
            {reply && (
              <ProjectNotesForm
                isCancelAvailable={true}
                title={t('Reply')}
                projectId={projectId}
                parentNoteId={note.id}
                onClose={() => setReply(false)}
              />
            )}
          </Flex>
        </>
      )}
    </Flex>
  );
};

export default SimpleNote;

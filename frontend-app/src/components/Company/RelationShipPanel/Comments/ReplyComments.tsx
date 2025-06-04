import { useQuery } from '@apollo/client';
import { Flex, Stack, Text } from '@chakra-ui/react';
import UserQueries from '../../../../graphql/Queries/UserQueries';
import { utcStringToDifferentDateTime } from '../../../../utils/date';
import { UserAvatar } from '../../../GenericComponents';
import {
  avatarBoxChat,
  iconsStyle,
  namesCommentTab,
  stackCommentBody,
  textCommentBody,
  timeCommentTab,
} from './stylesComments';
import { BsTrash3 } from 'react-icons/bs';
import { Edit } from '@material-ui/icons';

const { USER_PROFILE_GQL } = UserQueries;
interface Note {
  id: number;
  body: string;
  createdBy: string;
  created: string;
  parentNote: number;
  replies: Note[];
}

const ReplyComments = (props: { note: Note; creator: string; setActionComment: (data: any) => void }) => {
  const { note, setActionComment, creator } = props;

  const { data: userData } = useQuery(USER_PROFILE_GQL, {
    variables: { externalAuthSystemId: note.createdBy },
    fetchPolicy: 'cache-first',
  });

  const userId = userData?.userProfile?.id;
  const userName = userData?.userProfile?.givenName;
  const userSurname = userData?.userProfile?.surname;

  const date = utcStringToDifferentDateTime(note.created);
  const dateText = date === 'a few seconds ago' || date === 'in a few seconds' ? 'A few seconds ago' : date;

  return (
    <Stack p="8px 0px 0px 28px">
      <Flex ml="3px ">
        {userId && <UserAvatar userId={userId} sx={avatarBoxChat(true)} />}
        <Text pl="5px" mt="-5px" sx={namesCommentTab}>{`${userName ?? ''} ${userSurname ?? ''}`}</Text>
        <Text m="-5px 5px 0px 0px" sx={timeCommentTab}>
          -
        </Text>
        <Text pl="5px" mt="-5px" sx={timeCommentTab}>
          {dateText}
        </Text>
      </Flex>
      <Stack sx={stackCommentBody(true)}>
        <Text sx={textCommentBody}>{note?.body}</Text>
        <Flex justifyContent="flex-end" p="10px">
          {creator === userId && (
            <>
              <Edit
                style={iconsStyle}
                onClick={() => setActionComment({ id: note?.id, action: 'edit', textNote: note?.body, parentId: '' })}
              />
              <BsTrash3
                style={iconsStyle}
                onClick={() =>
                  setActionComment({ id: note?.id, action: 'delete', parentId: note?.parentNote ?? '', replies: false })
                }
              />
            </>
          )}
        </Flex>
      </Stack>
    </Stack>
  );
};

export default ReplyComments;

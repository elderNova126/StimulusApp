import { useQuery } from '@apollo/client';
import { Flex, Stack, Text } from '@chakra-ui/react';
import UserQueries from '../../../../graphql/Queries/UserQueries';
import { utcStringToDifferentDateTime } from '../../../../utils/date';
import { UserAvatar } from '../../../GenericComponents';
import {
  avatarBoxChat,
  iconsStyle,
  namesCommentTab,
  replyIconsStyle,
  stackCommentBody,
  textCommentBody,
  timeCommentTab,
} from './stylesComments';
import { BsTrash3, BsReply } from 'react-icons/bs';
import ReplyComments from './ReplyComments';
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

const CommentsTab = (props: { note: Note; creator: string; setActionComment: (data: any) => void }) => {
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
    <Stack p="10px" mt="10px">
      <Flex>
        {userId && <UserAvatar userId={userId} sx={avatarBoxChat(false)} />}
        <Text sx={namesCommentTab}>{`${userName ?? ''} ${userSurname ?? ''}`}</Text>
        <Text m="1px 5px 0px 0px" sx={timeCommentTab}>
          -
        </Text>
        <Text sx={timeCommentTab}>{dateText}</Text>
      </Flex>
      <Stack sx={stackCommentBody(false)}>
        <Text sx={textCommentBody}>{note?.body}</Text>
        <Flex justifyContent="flex-end" p="10px" pt="0px">
          <BsReply
            size="20px"
            style={replyIconsStyle}
            onClick={() => setActionComment({ id: '', action: 'reply', parentId: note?.id })}
          />
          {creator === userId && (
            <>
              <Edit
                style={iconsStyle}
                onClick={() => setActionComment({ id: note?.id, action: 'edit', textNote: note?.body, parentId: '' })}
              />
              <BsTrash3
                style={iconsStyle}
                onClick={() =>
                  setActionComment({
                    id: note?.id,
                    action: 'delete',
                    parentId: note?.parentNote ?? '',
                    replies: !!note?.replies?.length,
                  })
                }
              />
            </>
          )}
        </Flex>
      </Stack>
      {note?.replies?.map((reply: any) => {
        return <ReplyComments creator={creator} note={reply} setActionComment={setActionComment} />;
      })}
    </Stack>
  );
};

export default CommentsTab;

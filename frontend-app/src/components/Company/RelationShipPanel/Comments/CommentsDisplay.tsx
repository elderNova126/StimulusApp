import { useQuery } from '@apollo/client';
import { Flex, Stack, Text } from '@chakra-ui/react';
import { UserAvatar } from '../../../GenericComponents';
import UserQueries from '../../../../graphql/Queries/UserQueries';
import { utcStringToDifferentDateTime } from '../../../../utils/date';
import { avatarBox, bodyCommentsDisplay, namesCommentDisplay, timeCommentDisplay } from './stylesComments';

const { USER_PROFILE_GQL } = UserQueries;
const CommentsDisplay = (props: { comment?: any }) => {
  const { comment } = props;

  const { data: userData } = useQuery(USER_PROFILE_GQL, {
    variables: { externalAuthSystemId: comment?.createdBy },
    fetchPolicy: 'cache-first',
  });
  const userId = userData?.userProfile?.id;
  const userName = userData?.userProfile?.givenName;
  const userSurname = userData?.userProfile?.surname;

  return (
    <Stack p="10px 10px 0px 10px">
      <Flex>
        {userId && <UserAvatar userId={userId} sx={avatarBox} />}
        <Text sx={namesCommentDisplay}>{`${userName ?? ''} ${userSurname ?? ''}`}</Text>
        <Text sx={timeCommentDisplay}>{utcStringToDifferentDateTime(comment.created)}</Text>
      </Flex>
      <Text sx={bodyCommentsDisplay}>{comment?.body}</Text>
    </Stack>
  );
};

export default CommentsDisplay;

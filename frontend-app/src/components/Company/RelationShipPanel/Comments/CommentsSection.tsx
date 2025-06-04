import {
  Box,
  Text,
  Popover,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverTrigger,
  PopoverHeader,
  PopoverFooter,
  Stack,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import { useUser } from '../../../../hooks';
import CommentsDisplay from './CommentsDisplay';
import CommentsTab from './CommentsTab';
import TextAreaComments from './TextAreaComments';
import DeleteComments from './DeleteComments';
import NoCommentsDisplay from './NoCommentsDisplay';
import { Company } from '../../company.types';
import {
  boxCommentSection,
  boxPopoverAndDeleteModal,
  boxPopoverContent,
  boxPopoverTrigger,
  containerCommentTab,
  popoverBody,
  popoverHeader,
} from './stylesComments';

const CommentsSection = (props: { comments: any; company: Company }) => {
  const { t } = useTranslation();
  const { comments, company } = props;
  const {
    user: { sub: currentUserId },
  } = useUser();

  const [isOpen, setIsOpen] = useState(false);
  const [comment, setComment] = useState({ id: '', action: '', textNote: '', parentId: '', replies: false });

  useEffect(() => {
    if (!isOpen) {
      setComment({ id: '', action: '', textNote: '', parentId: '', replies: false });
    }
  }, [isOpen]);

  const [deleteModal, setDeleteModal] = useState(false);
  useEffect(() => {
    if (comment?.action === 'delete') {
      setDeleteModal(true);
    }
  }, [comment]);

  const sortedComments = comments
    ? [...comments]?.sort((a: any, b: any) => (new Date(b.created) as any) - (new Date(a.created) as any))
    : [];

  const getParentWithReplies = (array: any) => {
    const parents = array?.filter((objeto: any) => !objeto?.parentNote);

    const parentsWithReplies = parents?.map((parent: any) => {
      const replies = array?.filter((objeto: any) => objeto?.parentNote === parent?.id);
      return {
        ...parent,
        replies,
      };
    });

    return parentsWithReplies;
  };

  const filteredComments = getParentWithReplies(comments ?? []);

  return (
    <>
      <Box sx={boxCommentSection} gridColumn={{ base: 'span 2' }}>
        <Text as="h5" textStyle="h5">
          {t('Comments')}
        </Text>
        <Box>
          {sortedComments.length ? (
            <Box sx={boxPopoverAndDeleteModal}>
              <Box data-testid="boxCommentsDisplay" id="commentsDisplay">
                {sortedComments.slice(0, 2)?.map((comment: any) => {
                  return <CommentsDisplay comment={comment} key={comment?.id} />;
                })}
                <Text onClick={() => setIsOpen(true)} p="10px" textStyle="textLink">
                  {t('View All')}
                </Text>
                <Popover
                  isOpen={isOpen}
                  onClose={() => setIsOpen(false)}
                  closeOnBlur={deleteModal ? false : true}
                  onOpen={() => setIsOpen(true)}
                  isLazy
                >
                  <PopoverTrigger>
                    <Box sx={boxPopoverTrigger} />
                  </PopoverTrigger>
                  <PopoverContent sx={boxPopoverContent}>
                    <PopoverBody sx={popoverBody}>
                      <PopoverHeader sx={popoverHeader}>
                        <Text>{t('Company Comments')}</Text>
                      </PopoverHeader>
                      <PopoverCloseButton mt="10px" color="#2A2A28" />
                      <Stack sx={containerCommentTab} className="scrollBarComments">
                        {filteredComments?.map((comment: any) => {
                          return (
                            <CommentsTab
                              note={comment}
                              setActionComment={setComment}
                              creator={currentUserId}
                              key={comment?.id}
                            />
                          );
                        })}
                      </Stack>
                    </PopoverBody>
                    <PopoverFooter bg="#FFFFFF" borderTop="#EFEFEF" boxShadow="-4px 0px 10px -1px rgba(0, 0, 0, 0.11)">
                      <TextAreaComments
                        textNote={comment?.textNote}
                        action={comment?.action as string}
                        id={comment?.id as any}
                        parentId={comment?.parentId as any}
                        companyId={company?.id}
                        setComment={setComment}
                        userId={currentUserId}
                      />
                    </PopoverFooter>
                  </PopoverContent>
                </Popover>
              </Box>
            </Box>
          ) : (
            <NoCommentsDisplay companyId={company?.id} setOpen={setIsOpen} userId={currentUserId} />
          )}
        </Box>
      </Box>
      {deleteModal && (
        <DeleteComments
          comment={comment}
          companyId={company?.id}
          setComment={setComment}
          isOpen={deleteModal}
          setIsOpen={setDeleteModal}
        />
      )}
    </>
  );
};

export default CommentsSection;

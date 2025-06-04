import { useMutation } from '@apollo/client';
import * as R from 'ramda';
import { Box, Flex, Textarea, FormControl, Text } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import CompanyMutations from '../../../../graphql/Mutations/CompanyMutations';
import CompanyQueries from '../../../../graphql/Queries/CompanyQueries';
import { useStimulusToast, useErrorTranslation } from '../../../../hooks';
import { useForm } from 'react-hook-form';
import {
  boxTextAreaComment,
  flexNoCommentButton,
  noCommentsButton,
  textAreaComments,
  styleFormControl,
  setCounterColor,
  messageCommentError,
} from './stylesComments';
import { ValidationCommendSchema, COLUMN_NAME } from './CommentsSchemaValidation';
import StimButton from '../../../ReusableComponents/Button';

const { UPDATE_COMPANY_NOTE_GQL, CREATE_COMPANY_NOTE_GQL } = CompanyMutations;
const { COMPANY_NOTES_GQL } = CompanyQueries;
const TextAreaComments = (props: {
  action: string;
  textNote: string;
  id: number;
  parentId?: number;
  setComment?: (data: any) => void;
  companyId: string;
  userId?: string;
}) => {
  const { action, textNote, id, companyId, parentId, userId, setComment } = props;
  const [placeHolderText, setPlaceHolderText] = useState('Type your comments about this company here...');
  const [newValueText, setNewValueText] = useState('');
  const { t } = useTranslation();
  const errTranslations = useErrorTranslation();
  const { enqueueSnackbar } = useStimulusToast();
  const { register, setValue, errors } = useForm({
    resolver: ValidationCommendSchema,
  });

  const [saveNote, { loading: loadingCreate }] = useMutation(CREATE_COMPANY_NOTE_GQL, {
    update: (cache, { data: { createCompanyNote: noteData } }) => {
      const { companyNotes } = R.clone(cache.readQuery({ query: COMPANY_NOTES_GQL(companyId) })) as any;

      companyNotes.results = [...(companyNotes?.results || []), noteData];
      companyNotes.count = (companyNotes?.count ?? 0) + 1;

      cache.writeQuery({
        query: COMPANY_NOTES_GQL(companyId),
        data: { companyNotes: { ...companyNotes } },
      });

      setNewValueText('');
      if (setComment) {
        setComment({ id: '', action: '', textNote: '', parentId: '', replies: false });
      }
    },
  });

  const [updateNote, { loading: loadingUpdate }] = useMutation(UPDATE_COMPANY_NOTE_GQL, {
    update: (_, { data: { updateCompanyNote: noteData } }) => {
      if (noteData?.error) {
        return enqueueSnackbar(errTranslations[noteData.code], { status: 'error' });
      }
      if (setComment) {
        setComment({ id: '', action: '', textNote: '', parentId: '', replies: false });
      }

      enqueueSnackbar(`Comment  edited`, { status: 'success' });
    },
  });

  useEffect(() => {
    if (action === 'reply') {
      setNewValueText('');
    }
    if (action === 'edit') {
      setNewValueText(textNote ?? '');
    }
    if (!id) {
      setNewValueText('');
      setPlaceHolderText('Type your comments about this company here...');
    }
  }, [action, id]);

  const handleError = () => {
    if (newValueText.length > 250) {
      enqueueSnackbar(`Comments cannot exceed 250 characters`, { status: 'error' });
      return true;
    }
    if (newValueText.length === 0) {
      enqueueSnackbar(`Comments cannot be empty`, { status: 'error' });
      return true;
    }
    return false;
  };

  const handleUpdateNote = (id: number, body: string) => {
    if (handleError()) return;
    updateNote({ variables: { id, body } });
  };

  const handleSaveNote = () => {
    if (handleError()) return;
    saveNote({
      variables: { companyId, body: newValueText, ...(parentId && { parentNoteId: parentId }) },
      optimisticResponse: {
        createCompanyNote: {
          __typename: 'CompanyNote',
          id: null,
          created: null,
          body: newValueText,
          createdBy: userId,
          parentNote: parentId || null,
        },
      },
    })
      .then(() => enqueueSnackbar(`Comment added`, { status: 'success' }))
      .catch(() => enqueueSnackbar(`Error adding comment`, { status: 'error' }));

    if (setComment) {
      setComment({ action: '', id: '', parentId: '', textNote: '' });
    }
  };

  const handleSubmitComment = (type: string, id: number, body: string) => {
    if (type === 'edit') {
      return handleUpdateNote(id, body);
    }
    if (type === '' && !id) {
      return handleSaveNote();
    }
    if (!id && type === 'reply' && !!parentId) {
      return handleSaveNote();
    }
    return setPlaceHolderText('Type your comments about this company here...');
  };

  const handleOnChange = (value: string) => {
    setValue('comment', value, { shouldValidate: true });
    return setNewValueText(value);
  };

  return (
    <FormControl sx={styleFormControl}>
      <Text sx={messageCommentError} visibility={errors?.comment?.type === 'max' ? 'visible' : 'hidden'}>
        {t('Comments cannot exceed 250 characters')}
      </Text>
      <Box sx={boxTextAreaComment}>
        <Textarea
          id="textArea-comments"
          name="comment"
          rows={2.5}
          {...register(COLUMN_NAME)}
          sx={textAreaComments}
          placeholder={action === 'reply' ? 'Type your reply here...' : placeHolderText}
          onChange={(e: any) => handleOnChange(e.target.value)}
          value={newValueText}
        />
        <Flex sx={flexNoCommentButton}>
          <Text ml={'0.8rem'} textStyle="h6" color={setCounterColor(newValueText, 250)}>
            {' '}
            {newValueText.length}/250
          </Text>
          <Flex>
            {action === 'edit' || action === 'reply' ? (
              <StimButton
                variant="stimTextButton"
                size="stimSmall"
                onClick={() => {
                  if (setComment) {
                    setComment({ action: '', id: '', parentId: '', textNote: '' });
                  }
                  return setPlaceHolderText('Type your comments about this company here...');
                }}
                isLoading={loadingCreate || loadingUpdate}
                type="submit"
              >
                {t('CANCEL')}
              </StimButton>
            ) : null}
            <StimButton
              isLoading={loadingCreate || loadingUpdate}
              size="stimSmall"
              sx={noCommentsButton}
              type="submit"
              onClick={() => handleSubmitComment(action, id, newValueText)}
              ml="0.5rem"
            >
              {t(`${action === 'edit' ? 'Save' : 'Send'}`)}
            </StimButton>
          </Flex>
        </Flex>
      </Box>
    </FormControl>
  );
};

export default TextAreaComments;

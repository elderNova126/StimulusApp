import { Box, Flex, Textarea, Text } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import CompanyMutations from '../../../../graphql/Mutations/CompanyMutations';
import CompanyQueries from '../../../../graphql/Queries/CompanyQueries';
import { useMutation } from '@apollo/client';
import { useState, useEffect } from 'react';
import * as R from 'ramda';
import { useForm } from 'react-hook-form';
import { useStimulusToast } from '../../../../hooks';
import {
  flexNoCommentButton,
  noCommentsButton,
  noCommentsTextArea,
  setCounterColor,
  messageCommentError,
  noCommentsBox,
} from './stylesComments';
import { ValidationCommendSchema, COLUMN_NAME } from './CommentsSchemaValidation';
import StimButton from '../../../ReusableComponents/Button';

const { CREATE_COMPANY_NOTE_GQL } = CompanyMutations;
const { COMPANY_NOTES_GQL } = CompanyQueries;

const NoCommentsDisplay = (props: { companyId: string; setOpen: (data: boolean) => void; userId: string }) => {
  const { t } = useTranslation();
  const { enqueueSnackbar } = useStimulusToast();
  const { companyId, userId, setOpen } = props;
  const [newValueText, setNewValueText] = useState('');
  const { register, setValue, errors } = useForm({
    resolver: ValidationCommendSchema,
  });

  useEffect(() => {
    setValue('comment', newValueText, { shouldValidate: true });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

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
      setOpen(true);
    },
  });

  const handleOnChange = (value: string) => {
    setValue('comment', value, { shouldValidate: true });
    setNewValueText(value);
  };

  const handleSaveNote = () => {
    if (newValueText.length === 0) {
      enqueueSnackbar(errors?.comment?.message, { status: 'error' });
      return;
    }
    if (newValueText.length > 250) {
      enqueueSnackbar(errors?.comment?.message, { status: 'error' });
      return;
    }
    saveNote({
      variables: { companyId, body: newValueText },
      optimisticResponse: {
        createCompanyNote: {
          __typename: 'CompanyNote',
          id: null,
          created: null,
          body: newValueText,
          createdBy: userId,
        },
      },
    })
      .then(() => enqueueSnackbar(`Comment added`, { status: 'success' }))
      .catch(() => enqueueSnackbar(`Error adding comment`, { status: 'error' }));
  };

  return (
    <>
      <Box sx={noCommentsBox}>
        <Textarea
          id="textArea-comments"
          rows={1}
          sx={noCommentsTextArea}
          placeholder={t('Be the First to Leave A Comment...')}
          {...register(COLUMN_NAME)}
          onChange={(e: any) => handleOnChange(e.target.value)}
        />
        <Flex sx={flexNoCommentButton}>
          <Text marginRight={'1rem'} textStyle="h6" color={setCounterColor(newValueText, 250)}>
            {' '}
            {newValueText.length}/250
          </Text>
          <StimButton isLoading={loadingCreate} sx={noCommentsButton} onClick={handleSaveNote}>
            {t('SEND')}
          </StimButton>
        </Flex>
      </Box>
      <Text sx={messageCommentError} visibility={errors?.comment?.type === 'max' ? 'visible' : 'hidden'}>
        {t(errors?.comment?.message || 'Comments cannot exceed 250 characters')}
      </Text>
    </>
  );
};

export default NoCommentsDisplay;

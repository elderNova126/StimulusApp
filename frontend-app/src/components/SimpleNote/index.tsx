import { useQuery } from '@apollo/client';
import { DeleteIcon, EditIcon } from '@chakra-ui/icons';
import { Box, Button, Flex, Stack, Textarea, Tooltip } from '@chakra-ui/react';
import { Grid, Typography } from '@material-ui/core';
import { TimelineConnector, TimelineContent, TimelineItem, TimelineSeparator } from '@material-ui/lab';
import { withStyles } from '@material-ui/styles';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { MdReply } from 'react-icons/md';
import UserQueries from '../../graphql/Queries/UserQueries';
import { ConditionalWrapper } from '../../utils/conditionalWrapper';
import { utcStringToDifferentDateTime } from '../../utils/date';
import CompanyEvaluationNotesForm from '../CompanyEvaluationNotesForm/index';
import CompanyNotesForm from '../CompanyNotesForm/index';
import { UserAvatar } from '../GenericComponents';
import ProjectNotesForm from '../ProjectNotesForm/index';
import useStyles from './style';

const { USER_PROFILE_GQL } = UserQueries;
interface Note {
  id: number;
  body: string;
  createdBy: string;
  created: string;
}
export const NoteBody = (props: { body: string }) => {
  const [expanded, setExpanded] = useState(false);
  const { body } = props;
  const firstPart = body?.slice(0, 270);
  const secondPart = body?.slice(270);
  const { t } = useTranslation();
  const classes = useStyles();

  let additionalContent = null;
  if (secondPart) {
    additionalContent = (
      <>
        {!expanded && (
          <>
            <span>...</span>
            <span className={classes.seeMoreBtn} onClick={() => setExpanded(true)}>
              {t(' Show more')}
            </span>
          </>
        )}
        {expanded && (
          <>
            {secondPart}{' '}
            <span className={classes.seeMoreBtn} onClick={() => setExpanded(false)}>
              {t('Show less')}
            </span>
          </>
        )}
      </>
    );
  }

  return (
    <span className={classes.body}>
      {firstPart}
      <span>{additionalContent}</span>
    </span>
  );
};
export enum NOTE_CATEGORY {
  COMPANY = 'COMPANY',
  PROJECT = 'PROJECT',
  COMPANY_EVALUATION = 'COMPANY_EVALUATION',
}

const TimelineItemStyled = withStyles({
  missingOppositeContent: {
    '&:before': {
      display: 'none',
    },
  },
})(TimelineItem);

interface CurrentNote {
  id: number;
  type: string;
}

const SimpleNote = (props: {
  note: Note;
  editable?: boolean;
  showTimeline?: boolean;
  lastInTimeline?: boolean;
  onSubmitEdit?: (id: number, body: string) => Promise<void>;
  onDelete?: (id: any) => void;
  currentAction?: CurrentNote | null;
  canReply: boolean;
  noteRelation?: {
    type: NOTE_CATEGORY;
    id: string | number;
  };
  currentNote?: CurrentNote | null;
  setCurrentNote?: (data: CurrentNote) => void;
  setCurrentAction: (data: any) => void;
  className?: any;
}) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const {
    note,
    editable,
    onSubmitEdit,
    onDelete,
    noteRelation,
    canReply,
    currentNote,
    setCurrentNote,
    setCurrentAction,
  } = props;
  const [edit, setEdit] = useState(false);

  const [reply, setReply] = useState(false);
  const [noteBody, setNoteBody] = useState(note?.body ?? '');
  const [remove, setRemove] = useState(false);
  const { register, handleSubmit } = useForm();
  const [loadingEdit, setLoadingEdit] = useState(false);
  const { data: userData } = useQuery(USER_PROFILE_GQL, {
    variables: { externalAuthSystemId: note.createdBy },
    fetchPolicy: 'cache-first',
  });
  const user = userData?.userProfile;

  useEffect(() => {
    setReply(currentNote && currentNote.id === note.id && currentNote.type === 'reply' ? true : false);
    setEdit(currentNote && currentNote.id === note.id && currentNote.type === 'edit' ? true : false);
  }, [currentNote, note.id]);

  const handleToggleReply = (e: any) => {
    e.preventDefault();
    if (!reply) {
      setCurrentNote?.({ type: 'reply', id: note.id });
      setCurrentAction?.({ action: 'reply', id: note.id });
    } else {
      setCurrentAction?.({ action: 'none', id: null });
    }
    setReply(!reply);
  };

  const handleToggleEdit = (e: any) => {
    e.preventDefault();
    if (!edit) {
      setCurrentNote?.({ type: 'edit', id: note.id });
      setCurrentAction?.({ action: 'edit', id: note.id });
    } else {
      setCurrentAction?.({ action: 'none', id: null });
    }
    setEdit(!edit);
  };

  const handleDelete = (e: any) => {
    e.preventDefault();
    if (onDelete) {
      onDelete(note);
    }
    setRemove(!remove);
  };
  const closeOnEscape = (e: any) => {
    if (['Escape'].indexOf(e.key) > -1) {
      setEdit(false);
      setCurrentAction?.({ action: 'none', id: null });
    }
  };

  return (
    <div>
      <>
        <Grid container direction="row">
          <TimelineItemStyled>
            <ConditionalWrapper
              condition={props.showTimeline}
              wrapper={(children: any) => (
                <TimelineSeparator>
                  {children}
                  <TimelineConnector
                    className={props?.lastInTimeline ? classes.transparentConnector : classes.connector}
                  />
                </TimelineSeparator>
              )}
            >
              <UserAvatar userId={note.createdBy} />
            </ConditionalWrapper>
            <ConditionalWrapper
              condition={props.showTimeline}
              wrapper={(children: any) => <TimelineContent>{children}</TimelineContent>}
            >
              <div className={classes.noteContent}>
                <Typography className={classes.noteBody} data-testid="project-notes-note-body">
                  <p className={classes.username}>{`${user?.givenName ?? ''} ${user?.surname ?? ''}`}</p>
                  {edit ? (
                    <form
                      className={classes.editForm}
                      onSubmit={handleSubmit(() => {
                        setLoadingEdit(true);
                        onSubmitEdit?.(note.id, noteBody).then(() => {
                          setEdit(false);
                          setLoadingEdit(false);
                        });
                      })}
                    >
                      <Textarea
                        onKeyDown={closeOnEscape}
                        ref={register({ required: t('This is required') as string })}
                        autoFocus
                        placeholder={t('Comment')}
                        name="noteBody"
                        className={classes.inputEdit}
                        maxLength={500}
                        variant="outlined"
                        value={noteBody}
                        onChange={(e) => setNoteBody(e.target.value)}
                        data-testid="project-notes-edit-textfield"
                      />
                      <Stack isInline mt="5px">
                        <Button
                          h="35px"
                          isLoading={loadingEdit}
                          type="submit"
                          colorScheme="green"
                          isDisabled={noteBody.length === 0 ? true : false}
                        >
                          Send
                        </Button>
                        <Button
                          size="sm"
                          variant="outlined"
                          fontWeight="medium"
                          textDecor="underline"
                          lineHeight="15px"
                          h="35px"
                          onClick={() => setEdit(false)}
                        >
                          {t('Cancel')}
                        </Button>
                      </Stack>
                    </form>
                  ) : (
                    <NoteBody body={note.body} />
                  )}
                </Typography>
              </div>

              <Flex>
                <p className={classes.time}>{utcStringToDifferentDateTime(note.created)}</p>
                {!edit && (
                  <Box className={classes.actions}>
                    <span>
                      {canReply && (
                        <Tooltip label="Comment">
                          <MdReply
                            onClick={handleToggleReply}
                            className={reply ? classes.iconButtonActive : classes.iconButton}
                          />
                        </Tooltip>
                      )}
                      {editable && (
                        <>
                          <Tooltip label="Edit">
                            <EditIcon onClick={handleToggleEdit} className={classes.iconButton} />
                          </Tooltip>
                          <Tooltip label="Delete">
                            <DeleteIcon
                              onClick={handleDelete}
                              className={remove ? classes.iconButtonActive : classes.iconButton}
                            />
                          </Tooltip>
                        </>
                      )}
                    </span>
                  </Box>
                )}
              </Flex>
            </ConditionalWrapper>
          </TimelineItemStyled>
        </Grid>
        {reply && (
          <Grid item xs={12} container>
            <Grid item xs={11}>
              {noteRelation?.type === NOTE_CATEGORY.PROJECT && (
                <ProjectNotesForm
                  projectId={noteRelation.id as number}
                  parentNoteId={note.id}
                  onClose={() => setReply(false)}
                />
              )}
              {noteRelation?.type === NOTE_CATEGORY.COMPANY && (
                <CompanyNotesForm
                  companyId={noteRelation.id as string}
                  parentNoteId={note.id}
                  onClose={() => setReply(false)}
                  setCurrentAction={setCurrentAction}
                />
              )}
              {noteRelation?.type === NOTE_CATEGORY.COMPANY_EVALUATION && (
                <CompanyEvaluationNotesForm
                  companyEvaluationId={noteRelation.id as number}
                  parentNoteId={note.id}
                  onClose={() => setReply(false)}
                />
              )}
            </Grid>
          </Grid>
        )}
      </>
    </div>
  );
};

export default SimpleNote;

import { FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Spinner, Stack, Text, Center, Divider } from '@chakra-ui/react';
import { Dialog } from '../GenericComponents';
import { toCapitalCase } from '../../utils/string';
import StimButton from '../ReusableComponents/Button';

interface Props {
  open: boolean;
  title?: string;
  action?: string;
  onClose: () => void;
  submit: (answers?: any) => void;
  isLoading: boolean;
}

const ChangeCompanyTypeModal: FC<Props> = ({ onClose, submit, open, action, isLoading, title }) => {
  const { t } = useTranslation();

  return (
    <Dialog
      isOpen={open}
      onClose={onClose}
      actions={
        <>
          {isLoading && <Spinner />}
          <StimButton isDisabled={isLoading} variant="stimOutline" onClick={onClose} size="stimSmall">
            {t('Cancel')}
          </StimButton>
          <StimButton onClick={() => submit()} isDisabled={isLoading} size="stimSmall" ml="1rem" variant="stimPrimary">
            {t('Save')}
          </StimButton>
        </>
      }
    >
      {title && (
        <>
          <Center>
            <Text as="h2" textStyle="h2" fontWeight="500">
              {title}
            </Text>
          </Center>
          <Divider mb="2.5rem" />
        </>
      )}
      <Text as="h2" textStyle="h2">
        {t('Are you sure you want to')} {action} {t('the company? This action cannot be reverted')}
      </Text>
    </Dialog>
  );
};
interface CriteriaAnswer {
  criteria: string;
  answer: boolean;
}
interface CriteriaModalProps extends Props {
  criteria: string[];
  answers: CriteriaAnswer[];
}
export const CriteriaCheckModal: FC<CriteriaModalProps> = ({
  onClose,
  submit,
  open,
  isLoading,
  criteria = [],
  answers,
  title,
}) => {
  const { t } = useTranslation();
  const [criteriaState, setCriteriaState] = useState<{ [key: string]: boolean | null | undefined }>({});
  const [showError, setShowError] = useState(false);

  useEffect(() => {
    setShowError(false);
    setCriteriaState(
      criteria.reduce(
        (acc, criteria) => ({
          ...acc,
          [criteria]: answers?.find?.((response: CriteriaAnswer) => response.criteria === criteria)?.answer,
        }),
        {}
      )
    );
  }, [answers]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Dialog
      isOpen={open}
      onClose={() => {
        setShowError(false);
        onClose();
      }}
      actions={
        <>
          {isLoading && <Spinner />}
          <StimButton isDisabled={isLoading} variant="stimOutline" onClick={onClose} size="stimSmall">
            {t('Cancel')}
          </StimButton>
          <StimButton
            onClick={() => {
              const answers = Object.keys(criteriaState)
                .filter((criteria) => typeof criteriaState[criteria] !== 'undefined')
                .map((criteria: string) => ({ criteria, answer: criteriaState[criteria] }));
              if (answers.length !== criteria.length) {
                setShowError(true);
              } else {
                submit(answers);
                setShowError(false);
              }
            }}
            isDisabled={isLoading}
            mx="1rem"
            size="stimSmall"
          >
            {t('Save')}
          </StimButton>
        </>
      }
    >
      {title && (
        <>
          <Center>
            <Text as="h2" textStyle="h2" fontWeight="500">
              {title}
            </Text>
          </Center>
          <Divider mb="2.5rem" />
        </>
      )}
      <Stack spacing={4}>
        {Object.keys(criteriaState).map((criteria) => {
          const positiveBtnColor = criteriaState[criteria] === true ? 'green.600' : 'gray.200';
          const negativeBtnColor = criteriaState[criteria] === false ? 'secondary' : 'gray.200';
          const naBtnColor = criteriaState[criteria] === null ? 'primary' : 'gray.200';
          return (
            <Stack key={criteria} spacing={2}>
              <Text as="h5" textStyle="h5">
                <li>
                  <span>{toCapitalCase(criteria)}</span>
                </li>
              </Text>
              <Stack direction="row" spacing={4} pl="15px">
                <StimButton
                  size="stimSmall"
                  onClick={() => setCriteriaState({ ...criteriaState, [criteria]: true })}
                  variant="stimOutline"
                  p="0"
                  borderColor={positiveBtnColor}
                >
                  {t('Yes')}
                </StimButton>
                <StimButton
                  size="stimSmall"
                  onClick={() => setCriteriaState({ ...criteriaState, [criteria]: false })}
                  variant="stimOutline"
                  p="0"
                  borderColor={negativeBtnColor}
                >
                  {t('No')}
                </StimButton>
                <StimButton
                  size="stimSmall"
                  onClick={() => setCriteriaState({ ...criteriaState, [criteria]: null })}
                  variant="stimOutline"
                  p="0"
                  color={naBtnColor}
                  borderColor={naBtnColor}
                >
                  {t('NA')}
                </StimButton>
              </Stack>
              {showError && typeof criteriaState[criteria] === 'undefined' && (
                <Text pl="15px" textStyle="h5" color="red">
                  {t('Select one option')}
                </Text>
              )}
            </Stack>
          );
        })}
      </Stack>
    </Dialog>
  );
};

export default ChangeCompanyTypeModal;

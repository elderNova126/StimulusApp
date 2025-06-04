import { Flex, Icon, Skeleton, Text, Box } from '@chakra-ui/react';
import { FC, useContext, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BiCalendarEvent } from 'react-icons/bi';
import { useDispatch } from 'react-redux';
import { setProjectEndDate, setProjectStartDate } from '../../stores/features/projects';
import { CustomDatePicker } from '../GenericComponents';
import { FormProjectContext } from '../../hooks/projectForms/projectForm.provider';
import { ProjectFormFields } from '../../hooks/projectForms/projectFromValidations';
import FormErrorsMessage from '../GenericComponents/FormErrorsMessage';
interface FormDatePickerProps {
  text: string;
  pickerRef: any;
  setDate: (date: Date) => void;
  date: Date | undefined;
  isOpen: boolean;
  setIsOpen: () => void;
  minDate?: Date;
  isLoading: boolean;
  isInvalid?: boolean;
}

const FormDatePicker: FC<FormDatePickerProps> = ({
  text,
  pickerRef,
  setDate,
  date,
  isOpen,
  setIsOpen,
  minDate,
  isLoading,
  isInvalid,
}) => {
  const { t } = useTranslation();
  const inValidSx = {
    border: '1px solid red',
    borderRadius: '4px',
  };

  return (
    <Flex mr="1rem" flexDirection="column">
      <Text textStyle="body">{t(text)}</Text>
      {isLoading ? (
        <Skeleton width="160px" height="40px" startColor="green.100" endColor="green.400" />
      ) : (
        <Flex
          _focus={{ border: '1px solid blue', borderRadius: '4px' }}
          position="relative"
          ref={pickerRef}
          onClick={() => (isOpen ? null : setIsOpen())}
          flexDirection="row"
          sx={isInvalid ? inValidSx : {}}
        >
          <CustomDatePicker setDate={setDate} open={isOpen} minDate={minDate} date={date} placeholder="MM/DD/YYY" />
          <Icon
            position="absolute"
            right={3}
            top={1}
            boxSize="1.5rem"
            as={BiCalendarEvent}
            cursor="pointer"
            color="gray"
          />
        </Flex>
      )}
    </Flex>
  );
};

interface Props {
  projectStartDate: Date | undefined | null;
  projectEndDate: Date | undefined | null;
  isLoading: boolean;
  id?: string;
}

const CreateProjectDatePicker: FC<Props> = ({ projectStartDate, projectEndDate, isLoading, id }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [openStartDatePicker, setOpenStartDatePicker] = useState<boolean>(false);
  const [openEndDatePicker, setOpenEndDatePicker] = useState<boolean>(false);
  const startDatePickerRef = useRef(null);
  const endDatePickerRef = useRef(null);
  const { formMethods } = useContext(FormProjectContext)!;
  const { register, errors, setValue } = formMethods;
  const REQUIRED_MARK = '*';
  const listOfEvents = {
    [ProjectFormFields.PROJECT_START_DATE]: setProjectStartDate,
    [ProjectFormFields.PROJECT_END_DATE]: setProjectEndDate,
  };
  const handleCloseDataPiker = (field: string) =>
    field === ProjectFormFields.PROJECT_START_DATE ? setOpenStartDatePicker(false) : setOpenEndDatePicker(false);

  const handleValue = async (field: string, value: any) => {
    const event = listOfEvents[field as keyof typeof listOfEvents];
    dispatch(event(value as never));
    setValue(field, value, { shouldValidate: true });
    handleCloseDataPiker(field);
  };

  useEffect(() => {
    document.addEventListener('click', handleClickOutside, false);
    return () => {
      document.removeEventListener('click', handleClickOutside, false);
    };
  }, []); // eslint-disable-line

  const handleClickOutside = async (event: any) => {
    // @ts-ignore
    if (startDatePickerRef.current && !startDatePickerRef?.current.contains(event.target)) {
      setOpenStartDatePicker(false);
    }

    // @ts-ignore
    if (endDatePickerRef.current && !endDatePickerRef?.current.contains(event.target)) {
      setOpenEndDatePicker(false);
    }
  };

  return (
    <>
      <Text mt="2rem" as="h4" textStyle="h4">
        {t('Project Date')}
      </Text>
      <Flex mt="1rem" flexDirection="row" w="100%" alignItems="start">
        <Box>
          <FormDatePicker
            {...register(ProjectFormFields.PROJECT_START_DATE)}
            setDate={(newDate: Date) => handleValue(ProjectFormFields.PROJECT_START_DATE, newDate)}
            isInvalid={!!errors[ProjectFormFields.PROJECT_START_DATE]?.message}
            id={id ?? ProjectFormFields.PROJECT_START_DATE + REQUIRED_MARK}
            isLoading={isLoading}
            text={t(ProjectFormFields.PROJECT_START_DATE + REQUIRED_MARK)}
            pickerRef={startDatePickerRef}
            date={projectStartDate || undefined}
            isOpen={openStartDatePicker}
            setIsOpen={() => setOpenStartDatePicker(!openStartDatePicker)}
          />
          <FormErrorsMessage errorMessage={errors[ProjectFormFields.PROJECT_START_DATE]?.message} />
        </Box>
        <Box>
          <FormDatePicker
            {...register(ProjectFormFields.PROJECT_END_DATE)}
            setDate={(newDate: Date) => handleValue(ProjectFormFields.PROJECT_END_DATE, newDate)}
            isInvalid={!!errors[ProjectFormFields.PROJECT_END_DATE]?.message}
            id={id ?? ProjectFormFields.PROJECT_END_DATE}
            isLoading={isLoading}
            text={t(ProjectFormFields.PROJECT_END_DATE)}
            minDate={projectStartDate || undefined}
            pickerRef={endDatePickerRef}
            date={projectEndDate || undefined}
            isOpen={openEndDatePicker}
            setIsOpen={() => setOpenEndDatePicker(!openEndDatePicker)}
          />
          <FormErrorsMessage errorMessage={errors[ProjectFormFields.PROJECT_END_DATE]?.message} />
        </Box>
      </Flex>
    </>
  );
};

export default CreateProjectDatePicker;

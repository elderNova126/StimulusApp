import { Box, Flex, ListIcon, ListItem, Spinner, Text, UnorderedList } from '@chakra-ui/react';
import { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FiDelete } from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import { ProjectsState, setProjectSelectionCriteria } from '../../stores/features/projects';
import CreateProjectImage from './CreateProjectImage';
import CreateProjectInput from './CreateProjectInput';
import StimButton from '../ReusableComponents/Button';

interface Props {
  saveProject: (withCriteria: boolean, selectionCriteria: string[]) => void;
  loading: boolean;
  isLoading: boolean;
  isEdit: boolean;
}

const ProvideSupplierCriteria: FC<Props> = ({ saveProject, loading, isLoading, isEdit }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const projectSelectionCriteria: string[] = useSelector(
    (state: { projects: ProjectsState }) => state.projects?.projectSelectionCriteria
  );
  const [currentCriteria, setCurrentCriteria] = useState('');

  const handleOnClick = (withCriteria: boolean) => {
    const criteriaArray = currentCriteria.split(',').map((criteria) => criteria.trim());
    setCurrentCriteria('');
    saveProject(withCriteria, [...projectSelectionCriteria, ...criteriaArray]);
  };

  const removeCriteria = (criteria: string) => {
    const newCriteriaList = projectSelectionCriteria.filter((c) => c !== criteria);
    dispatch(setProjectSelectionCriteria([...newCriteriaList]));
  };

  return (
    <Box ml="2rem">
      <Text as="h1" textStyle="h1" pb="2rem">
        {!isEdit ? t('Provide Supplier Criteria') : t('Edit Project')}
      </Text>
      <Flex zIndex={1} w="75vw">
        <Box w="45%">
          <Text as="h3" textStyle="h3" fontStyle="italic" pb="2rem">
            {!isEdit
              ? t('Please Provide selection criteria for the Projects')
              : t(
                  'Modify your project info here. Press Save when completed or press Back to cancel your changes. Field prefixed with * are optional'
                )}
          </Text>
          <UnorderedList>
            {projectSelectionCriteria?.map((criteria) => (
              <ListItem position="relative" key={criteria}>
                {criteria}
                <ListIcon
                  cursor="pointer"
                  onClick={() => removeCriteria(criteria)}
                  height="25px"
                  width="25px"
                  position="absolute"
                  right="5px"
                  as={FiDelete}
                />
              </ListItem>
            ))}
          </UnorderedList>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (currentCriteria) {
                dispatch(setProjectSelectionCriteria([...projectSelectionCriteria, currentCriteria]));
                setCurrentCriteria('');
              }
            }}
          >
            <CreateProjectInput
              isLoading={isLoading}
              labelText={t('Criteria')}
              onChange={(newValue: string) => setCurrentCriteria(newValue)}
              inputValue={currentCriteria}
            />
          </form>
          <StimButton
            m="2rem 0 2rem 0"
            size="stimSmall"
            isDisabled={loading || !currentCriteria}
            {...(!loading && projectSelectionCriteria.length !== 0 && { colorScheme: 'green' })}
            onClick={() => loading || handleOnClick(true)}
          >
            {t('Save with Criteria')}
          </StimButton>
          <StimButton variant="stimTextButton" isDisabled={loading} onClick={() => handleOnClick(false)}>
            {t('Skip')}
          </StimButton>
          {loading && <Spinner />}
        </Box>
        <CreateProjectImage />
      </Flex>
    </Box>
  );
};

export default ProvideSupplierCriteria;

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getCompanyName } from '../../utils/dataMapper';
import { Box, Stack, Text, Tr, Th, Thead, Td, Tbody, Table, UnorderedList, ListItem } from '@chakra-ui/react';
import { Dialog } from '../GenericComponents';
import StimButton from '../ReusableComponents/Button';

const ProjectSelectionCriteria = (props: { project: { selectionCriteria: string[]; projectCompany: any[] } }) => {
  const [showAnswersModalOpen, setShowAnswersModalOpen] = useState(false);
  const { selectionCriteria = [], projectCompany } = props.project;
  const { t } = useTranslation();
  const suppliers = projectCompany?.filter(({ type }) => type !== 'CLIENT') ?? [];
  const criteriaModalActions = (
    <StimButton size="stimSmall" variant="stimOutline" onClick={() => setShowAnswersModalOpen(false)}>
      {t('Close')}
    </StimButton>
  );

  const answerMappers = (value: boolean | null) => {
    if (value === true) {
      return t('Yes');
    } else if (value === false) {
      return t('No');
    } else {
      return t('NA');
    }
  };

  return (
    <Stack data-testid="projectSelectionCriteria" pt="2rem" spacing={3}>
      <Text as="h5" textStyle="h5">
        {t('Selection Criteria')}
      </Text>
      {selectionCriteria?.length > 0 ? (
        <Box>
          <UnorderedList spacing={3}>
            {selectionCriteria?.map?.((criteria: string) => (
              <ListItem key={criteria}>
                <Text textStyle="body">{criteria}</Text>
              </ListItem>
            ))}
          </UnorderedList>
          {suppliers.length > 0 && (
            <StimButton size="stimSmall" mt="20px" onClick={() => setShowAnswersModalOpen(true)} variant="stimOutline">
              {t('Show Selection Criteria Responses')}
            </StimButton>
          )}
        </Box>
      ) : (
        <Text>{t('No criteria set for this project. You can add selection criteria by editing this project')}</Text>
      )}
      <Dialog
        dialogProps={{ size: '6xl', isCentered: true } as any}
        isOpen={showAnswersModalOpen}
        onClose={() => setShowAnswersModalOpen(false)}
        actions={criteriaModalActions}
      >
        <Box overflowX="auto">
          <Table>
            <Thead>
              <Tr>
                <Th>{t('Criteria')}</Th>
                {suppliers.map(({ company }) => (
                  <Th key={company.id}>{getCompanyName(company)}</Th>
                ))}
              </Tr>
            </Thead>
            <Tbody>
              {selectionCriteria.map((criteria: string, index: number) => (
                <Tr key={`${criteria}_${index}`} _hover={{ bg: '#F6F6F6' }}>
                  <Td>
                    <Text textStyle="body">{criteria}</Text>
                  </Td>
                  {suppliers.map(({ company, criteriaAnswers }) => (
                    <Td key={`${criteria}_${company.id}`}>
                      <Text textStyle="body">
                        {answerMappers(
                          criteriaAnswers?.find?.(({ criteria: target }: any) => target === criteria)?.answer
                        )}
                      </Text>
                    </Td>
                  ))}
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      </Dialog>
    </Stack>
  );
};

export default ProjectSelectionCriteria;

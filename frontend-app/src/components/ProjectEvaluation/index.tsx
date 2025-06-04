import { Box, Flex, Text } from '@chakra-ui/react';
import { navigate } from '@reach/router';
import { useTranslation } from 'react-i18next';
import { convertToShortNo } from '../../utils/number';
import { ProjectCompanyModel } from './evaluation.interface';
import StimButton from '../ReusableComponents/Button';

const ProjectEvaluation = (props: { projectCompany: ProjectCompanyModel; onSelect: () => void }) => {
  const { t } = useTranslation();
  const { projectCompany, onSelect } = props;
  const companyEvaluations = projectCompany.evaluations?.[0] || [];
  const numberLabels = {
    thousand: t('K'),
    million: t('mil'),
  };

  const showCompanyBudgetSpend = () => {
    if (companyEvaluations && companyEvaluations.budgetSpend && companyEvaluations.budgetSpend > 0) {
      return (
        <Text marginTop="4px" as="h6" textStyle="h6" color="#000">
          {`${t('Spend')}: ${convertToShortNo(numberLabels, companyEvaluations.budgetSpend)}`}
        </Text>
      );
    }
  };

  return (
    <Flex width="auto" flexDirection="column" marginTop="2.5rem">
      <Text
        marginBottom=".4rem"
        data-testid="companyName"
        fontSize="18px"
        onClick={() => navigate(`/company/${projectCompany?.companyId}`)}
        cursor="pointer"
        _hover={{ textDecoration: 'underline' }}
      >
        {projectCompany.company ? projectCompany.company.legalBusinessName : ''}
      </Text>
      <Flex flexDirection="row">{showCompanyBudgetSpend()}</Flex>
      <Box>
        <Text fontWeight="400" fontSize="12px" color="#2A2A28" mb="10px">
          Get started on your evaluation of this company.
        </Text>
        <StimButton variant="stimOutline" size="stimSmall" onClick={onSelect}>
          {t('Start')}
        </StimButton>
      </Box>
    </Flex>
  );
};

export default ProjectEvaluation;
